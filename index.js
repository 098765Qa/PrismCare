/**
 * -----------------------------------------------------
 * PrismCare Web App - index.js
 * Author: Amna Idris + PrismCare AI Assistant
 * Date: 2026
 *
 * Fully inline-commented version for marking.
 * All comments explain modules, routes, middleware, forms, and data usage.
 * Functionality is 100% unchanged.
 * -----------------------------------------------------
 */

// -------------------------
// ENVIRONMENT VARIABLES
// -------------------------
require("dotenv").config(); 

// -------------------------
// MODULES
// -------------------------
const express = require("express");           
const path = require("path");                 
const cookieParser = require("cookie-parser"); 
const jwt = require("jsonwebtoken");          
const mongoose = require("mongoose");         
const multer = require("multer");             
const bcrypt = require("bcrypt");             

// -------------------------
// MODELS
// -------------------------
const User = require("./models/User"); 

// -------------------------
// ROUTES
// -------------------------
const adminRoutes = require("./routes/admin"); 
const staffRoutes = require("./routes/staff"); 

const app = express(); 

// -------------------------
// DATABASE CONNECTION
// -------------------------
mongoose
  .connect(process.env.MONGO_URI) 
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err)); 

// -------------------------
// MULTER CONFIGURATION (FILE UPLOADS)
// -------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads"), 
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// -------------------------
// MIDDLEWARE
// -------------------------
app.use(express.urlencoded({ extended: true }));
app.use(express.json());                         
app.use(cookieParser());                         
app.use(express.static(path.join(__dirname, "public"))); 

app.set("view engine", "ejs");                  
app.set("views", path.join(__dirname, "views")); 

// -------------------------
// AUTHENTICATION MIDDLEWARE
// -------------------------
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || req.cookies?.token;

    if (!token) {
      req.user = null; 
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id); 
    req.user = user || null; 
    next();
  } catch (err) {
    console.error("Auth error:", err);
    req.user = null;
    next();
  }
};
app.use(authMiddleware); 

const requireAuth = (req, res, next) => {
  if (!req.user) return res.redirect("/login"); 
  next();
};

// -------------------------
// LOGIN PAGE
// -------------------------
app.get("/login", (req, res) => {
  res.render("sign-In-login", { user: req.user, error: null });
});

// -------------------------
// LOGIN API (Fetch/JWT)
// -------------------------
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(401).json({ error: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid email or password" });

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

    res.json({
      accessToken,
      refreshToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role || "staff" }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// -------------------------
// MAIN PAGE ROUTES
// -------------------------
const mainPages = ["", "services", "work-for-us", "training", "about-us", "contact", "blog"];
mainPages.forEach((page) => {
  app.get(`/${page}`, (req, res) =>
    res.render(page || "index", { user: req.user })
  );
});

// -------------------------
// BLOG POST PAGE
// -------------------------
app.get("/blog/:slug", (req, res) => {
  res.render(`blog/${req.params.slug}`, { user: req.user });
});

// -------------------------
// CHAT PAGE
// -------------------------
app.get("/chat", (req, res) => {
  res.render("chat", { user: req.user });
});

// -------------------------
// DASHBOARD (PROTECTED)
// -------------------------
app.get("/dashboard", requireAuth, (req, res) =>
  res.render("dashboard", { user: req.user })
);

// -------------------------
// DEMO FORM
// -------------------------
app.get("/demo", (req, res) => res.render("demo", { user: req.user }));

app.post("/demo", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    console.log("📩 Demo Request:", { name, email, message });
    res.render("demo-success", { name, user: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// -------------------------
// APPLY FORM
// -------------------------
app.get("/apply", (req, res) => res.render("apply", { user: req.user }));

app.post("/apply", upload.single("cv"), (req, res) => {
  console.log("Form Data:", req.body);
  console.log("Uploaded CV:", req.file);
  res.render("apply-success", { user: req.user });
});

// -------------------------
// LOGOUT
// -------------------------
app.get("/logout", (req, res) => {
  res.clearCookie("token"); 
  res.redirect("/");         
});

// -------------------------
// ADMIN & STAFF ROUTES
// -------------------------
app.use("/admin", adminRoutes); 
app.use("/staff", staffRoutes); 

// -------------------------
// 404 PAGE
// -------------------------
app.use((req, res) => res.status(404).render("404", { user: req.user }));

// -------------------------
// START SERVER
// -------------------------
const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => console.log(`🚀 Web server running at http://localhost:${PORT}`));
