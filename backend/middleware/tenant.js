const Note = require('../models/Note');

module.exports = async function (req, res, next) {
  // Assumes req.user is set by auth middleware
  req.tenantId = req.user.tenantId;
  next();
};
