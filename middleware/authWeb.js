const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper to read accessToken from cookies
function getAccessTokenFromCookies(req) {
  const cookieHeader = req.headers.cookie || '';
  const cookies = {};

  cookieHeader.split(';').forEach(pair => {
    const [key, value] = pair.split('=').map(x => x && x.trim());
    if (key && value) cookies[key] = decodeURIComponent(value);
  });

  return cookies['accessToken'] || null;
}

// Generic web JWT auth
async function requireWebAuth(req, res, next) {
  try {
    const token = getAccessTokenFromCookies(req);
    if (!token) {
      return res.redirect('/login');
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    const user = await User.findById(decoded.sub);
    if (!user || !user.isActive) {
      return res.redirect('/login');
    }

    req.user = user;
    next();
  } catch (err) {
    // Token invalid or expired → redirect to login
    return res.redirect('/login');
  }
}

// Admin-only
async function requireWebAdmin(req, res, next) {
  await requireWebAuth(req, res, async () => {});
  if (!req.user) return;

  if (req.user.role !== 'admin') {
    return res.status(403).send('Forbidden');
  }

  next();
}

// Staff-only
async function requireWebStaff(req, res, next) {
  await requireWebAuth(req, res, async () => {});
  if (!req.user) return;

  if (req.user.role !== 'staff') {
    return res.status(403).send('Forbidden');
  }

  next();
}

module.exports = {
  requireWebAuth,
  requireWebAdmin,
  requireWebStaff
};