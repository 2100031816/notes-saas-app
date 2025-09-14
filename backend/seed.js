require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Tenant = require('./models/Tenant');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);

  // Create tenants
  const acme = await Tenant.findOneAndUpdate(
    { slug: 'acme' },
    { name: 'Acme', slug: 'acme', plan: 'Free' },
    { upsert: true, new: true }
  );
  const globex = await Tenant.findOneAndUpdate(
    { slug: 'globex' },
    { name: 'Globex', slug: 'globex', plan: 'Free' },
    { upsert: true, new: true }
  );

  // Create users
  const passwordHash = await bcrypt.hash('password', 10);
  const users = [
    { email: 'admin@acme.test', role: 'Admin', tenantId: acme._id },
    { email: 'user@acme.test', role: 'Member', tenantId: acme._id },
    { email: 'admin@globex.test', role: 'Admin', tenantId: globex._id },
    { email: 'user@globex.test', role: 'Member', tenantId: globex._id },
  ];

  for (const u of users) {
    await User.findOneAndUpdate(
      { email: u.email },
      { ...u, password: passwordHash },
      { upsert: true, new: true }
    );
  }

  console.log('Seeded tenants and users!');
  process.exit();
}

seed();
