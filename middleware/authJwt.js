const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyAccessToken } = require('../utils/jwt');

function getTokenFromHeader(req) {
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) return null;
  return auth.substring(7);
}

async function attachUserFromToken(decoded) {
  return User.findById(decoded.sub);
}

// API: generic JWT
async function requireJwt(req, res, next) {
  try {
    const token = getTokenFromHeader(req);
    if (!token) return res.status(401).json({ error: 'Missing token' });

    const decoded = verifyAccessToken(token);
    const user = await attachUserFromToken(decoded);
    if (!user) return res.status(401).json({ error: 'User not found' });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// API: admin only
async function requireAdminJwt(req, res, next) {
  await requireJwt(req, res, async (err) => {
    if (err) return; // handled above
  });
  if (!req.user) return; // already handled

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin only' });
  }
  next();
}

// API: staff only
async function requireStaffJwt(req, res, next) {
  await requireJwt(req, res, async (err) => {
    if (err) return;
  });
  if (!req.user) return;

  if (req.user.role !== 'staff') {
    return res.status(403).json({ error: 'Staff only' });
  }
  next();
}

module.exports = {
  requireJwt,
  requireAdminJwt,
  requireStaffJwt
};