/**
 * -----------------------------------------------------
 * ROUTES: Visits
 * ROLE: Handle all visit-related HTTP endpoints for:
 *       - Admin scheduling (CRUD)
 *       - Staff workflows (my visits, start/end, tasks)
 *       - Shared visit details
 *
 * AUTHOR: Amna Idris + PrismCare AI Assistant
 * DATE: 2026
 *
 * ROADMAP:
 * - Add admin filters (by date, branch, status)
 * - Add bulk scheduling + templates
 * - Add AI visit suggestions + clash detection
 * - Add export/report endpoints for audits + CQC
 * -----------------------------------------------------
 */

const express = require("express");
const router = express.Router();

const visitController = require("./visit.controller");
const authMiddleware = require("../auth/auth.middleware");
const roleMiddleware = require("../auth/role.middleware");

// All visit routes require authentication
router.use(authMiddleware);

// -----------------------------------------------------
// ADMIN ROUTES (FULL CONTROL)
// -----------------------------------------------------

// Create visit
router.post("/", roleMiddleware("admin"), visitController.createVisit);

// Get all visits
router.get("/", roleMiddleware("admin"), visitController.getAllVisits);

// Update visit
router.put("/:id", roleMiddleware("admin"), visitController.updateVisit);

// Delete visit
router.delete("/:id", roleMiddleware("admin"), visitController.deleteVisit);

// -----------------------------------------------------
// STAFF ROUTES — MY VISITS
// -----------------------------------------------------

// My upcoming visits
router.get("/me/upcoming", visitController.getMyUpcomingVisits);

// My visits for today
router.get("/me/today", visitController.getMyTodayVisits);

// -----------------------------------------------------
// STAFF ROUTES — VISIT WORKFLOW
// -----------------------------------------------------

// Start visit (clock-in)
router.put("/:id/start", visitController.startVisit);

// End visit (clock-out)
router.put("/:id/end", visitController.endVisit);

// -----------------------------------------------------
// STAFF ROUTES — TASKS
// -----------------------------------------------------

// Get tasks for a visit
router.get("/:id/tasks", visitController.getVisitTasks);

// Complete a task
router.put("/:id/tasks/:taskId/complete", visitController.completeTask);

// -----------------------------------------------------
// SHARED ROUTE — VISIT DETAILS (ADMIN + STAFF)
// -----------------------------------------------------

router.get("/:id", visitController.getVisitById);

module.exports = router;