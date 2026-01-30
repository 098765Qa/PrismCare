const express = require("express");
const router = express.Router();

// -----------------------------------------------------
// ADMIN DASHBOARD (FRONTEND)
// -----------------------------------------------------

// Dashboard home
router.get("/", (req, res) => {
  res.render("admin/dashboard", { user: req.user });
});

// Staff management
router.get("/staff", (req, res) => {
  res.render("admin/staff", { user: req.user });
});

// Clients management
router.get("/clients", (req, res) => {
  res.render("admin/clients", { user: req.user });
});

// Visits
router.get("/visits", (req, res) => {
  res.render("admin/visits", { user: req.user });
});

// Medication
router.get("/medication", (req, res) => {
  res.render("admin/medication", { user: req.user });
});

// Settings
router.get("/settings", (req, res) => {
  res.render("admin/settings", { user: req.user });
});

module.exports = router;