const bcrypt = require("bcryptjs");
const User = require("./user.model");
const tokenService = require("./token.service");

module.exports = {
  // -------------------------
  // REGISTER
  // -------------------------
  register: async (req, res) => {
    try {
      const { email, password, role, staffId, clientId } = req.body;

      const existing = await User.findOne({ email });
      if (existing)
        return res.status(400).json({ message: "Email already exists" });

      // Hash password with bcrypt
      const passwordHash = await bcrypt.hash(password, 10);

      const user = await User.create({
        email,
        passwordHash,
        role,
        staffId,
        clientId,
      });

      return res
        .status(201)
        .json({ message: "User registered", userId: user._id });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Registration error", error: err.message });
    }
  },

  // -------------------------
  // LOGIN
  // -------------------------
  login: async (req, res) => {
    try {
      const { email, password, deviceInfo } = req.body;

      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "Invalid credentials" });

      // Compare password
      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        user.loginHistory.push({
          success: false,
          timestamp: new Date(),
          ip: req.ip,
          userAgent: req.headers["user-agent"],
        });
        await user.save();
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Generate tokens
      const accessToken = tokenService.generateAccessToken(user);
      const refreshToken = tokenService.generateRefreshToken(user);

      // Update login history
      user.loginHistory.push({
        success: true,
        timestamp: new Date(),
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        device: deviceInfo,
      });

      user.lastActive = new Date();
      await user.save();

      return res.json({
        message: "Login successful",
        accessToken,
        refreshToken,
        role: user.role,
      });
    } catch (err) {
      return res.status(500).json({ message: "Login error", error: err.message });
    }
  },

  // -------------------------
  // REFRESH TOKEN
  // -------------------------
  refresh: async (req, res) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken)
        return res.status(400).json({ message: "No refresh token" });

      const decoded = tokenService.verifyRefreshToken(refreshToken);
      const user = await User.findById(decoded.id);

      if (!user) return res.status(401).json({ message: "User not found" });

      const newAccessToken = tokenService.generateAccessToken(user);

      return res.json({ accessToken: newAccessToken });
    } catch (err) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
  },
};
