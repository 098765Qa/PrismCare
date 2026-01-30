const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, required: true, unique: true },
  passwordHash: String,
  role: { type: String, enum: ['admin','staff','client'], default: 'staff' },
  googleTokens: {},
  avatar: String,
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
