/**
 * -----------------------------------------------------
 * ROUTES: Wellbeing
 * ROLE: Daily wellbeing checks for clients
 *
 * AUTHOR: Amna Idris + PrismCare AI Assistant
 * DATE: 2026
 * -----------------------------------------------------
 */

const express = require("express");
const router = express.Router();

const wellbeingController = require("./wellbeing.controller");
const authMiddleware = require("../auth/auth.middleware");
const roleMiddleware = require("../auth/role.middleware");

// All wellbeing routes require authentication
router.use(authMiddleware);

// Staff: create wellbeing check
router.post("/", wellbeingController.createWellbeing);

// Staff + Admin: get wellbeing for a client
router.get("/client/:clientId", wellbeingController.getClientWellbeing);

// Admin: delete wellbeing entry
router.delete("/:id", roleMiddleware("admin"), wellbeingController.deleteWellbeing);

module.exports = router;