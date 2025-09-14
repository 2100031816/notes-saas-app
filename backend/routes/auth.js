const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Tenant = require('../models/Tenant');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token });
});

// Invite user (Admin only)
router.post('/invite', auth, role(['Admin']), async (req, res) => {
  const { email, role: userRole } = req.body;
  if (!['Admin', 'Member'].includes(userRole)) return res.status(400).json({ message: 'Invalid role' });
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'User already exists' });
  const password = 'password'; // Default password for test accounts
  const hash = await bcrypt.hash(password, 10);
  const user = new User({
    email,
    password: hash,
    role: userRole,
    tenantId: req.user.tenantId
  });
  await user.save();
  res.json({ message: 'User invited', user });
});

// Upgrade tenant plan (Admin only)
router.post('/tenants/:slug/upgrade', auth, role(['Admin']), async (req, res) => {
  const tenant = await Tenant.findOne({ slug: req.params.slug });
  if (!tenant) return res.status(404).json({ message: 'Tenant not found' });
  if (String(tenant._id) !== String(req.user.tenantId)) return res.status(403).json({ message: 'Forbidden' });
  tenant.plan = 'Pro';
  await tenant.save();
  res.json({ message: 'Upgraded to Pro' });
});

module.exports = router;
