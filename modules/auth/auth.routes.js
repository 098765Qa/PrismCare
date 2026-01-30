const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    // Check password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid email or password' });

    // Create JWT tokens
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Send cookie for accessToken
    res.cookie('token', accessToken, {
      httpOnly: true,      // Not accessible via JS
      sameSite: 'lax',     // CSRF safe
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    // Send JSON with refreshToken and user info
    res.json({
      message: 'Login successful',
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'staff'
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
