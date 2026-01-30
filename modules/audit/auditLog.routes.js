const express = require("express");
const router = express.Router();

const auditController = require("./auditLog.controller");
const authMiddleware = require("../auth/auth.middleware");
const roleMiddleware = require("../auth/role.middleware");

router.use(authMiddleware);

// Admin: view audit logs
router.get("/entity/:entityType/:entityId", roleMiddleware("admin"), auditController.getEntityAudit);
router.get("/user/:userId", roleMiddleware("admin"), auditController.getUserAudit);

module.exports = router;