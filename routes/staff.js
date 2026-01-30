const express = require("express");
const router = express.Router();

// -----------------------------------------------------
// STAFF DASHBOARD (FRONTEND)
// -----------------------------------------------------

// Staff home
router.get("/", (req, res) => {
  res.render("staff/home", { user: req.user });
});

// Visits
router.get("/visits", (req, res) => {
  res.render("staff/visits", { user: req.user });
});

// Clients
router.get("/clients", (req, res) => {
  res.render("staff/clients", { user: req.user });
});

// Medication
router.get("/medication", (req, res) => {
  res.render("staff/medication", { user: req.user });
});

// Wellbeing
router.get("/wellbeing", (req, res) => {
  res.render("staff/wellbeing", { user: req.user });
});

// Offline mode
router.get("/offline", (req, res) => {
  res.render("staff/offline", { user: req.user });
});

module.exports = router;