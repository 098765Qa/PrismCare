const express = require('express');
const router = express.Router();

const gpsController = require('./gpslog.controller'); // ✅ Correct
const authMiddleware = require("../auth/auth.middleware");
const roleMiddleware = require("../auth/role.middleware");

// All GPS routes require authentication
router.use(authMiddleware);

// Create GPS log
router.post("/", gpsController.createGPSLog);

// Get all logs for a staff member
router.get("/staff/:staffId", gpsController.getStaffLogs);

// Get logs for a specific visit
router.get("/visit/:visitId", gpsController.getVisitLogs);

// Admin: delete GPS log
router.delete("/:id", roleMiddleware("admin"), gpsController.deleteGPSLog);

module.exports = router;
