/**
 * -----------------------------------------------------
 * ROUTES: Offline Sync
 * ROLE: Handle staff offline actions and admin views
 * -----------------------------------------------------
 */

const express = require("express");
const router = express.Router();
const offlineController = require("./offlineRecord.controller");
const authMiddleware = require("../auth/auth.middleware");
const roleMiddleware = require("../auth/role.middleware");

// Require authentication for all offline routes
router.use(authMiddleware);

// STAFF: create offline record
router.post("/", offlineController.saveOffline);

// STAFF: sync offline records
router.post("/sync", offlineController.syncOffline);

// ADMIN: view unsynced offline records
router.get("/pending", roleMiddleware("admin"), offlineController.getPendingOffline);

module.exports = router;
