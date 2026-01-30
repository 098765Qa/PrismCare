const express = require("express");
const router = express.Router();

const staffController = require("./staff.controller");
const authMiddleware = require("../auth/auth.middleware");
const roleMiddleware = require("../auth/role.middleware");

// All staff routes require auth
router.use(authMiddleware);

// Admin-only create/update/delete
router.post("/", roleMiddleware("admin"), staffController.createStaff);
router.put("/:id", roleMiddleware("admin"), staffController.updateStaff);
router.delete("/:id", roleMiddleware("admin"), staffController.deleteStaff);

// Admin + staff can view
router.get("/", staffController.getAllStaff);
router.get("/:id", staffController.getStaffById);

module.exports = router;