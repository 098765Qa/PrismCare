const express = require("express");
const router = express.Router();

const aiController = require("./aiInsights.controller");
const authMiddleware = require("../auth/auth.middleware");
const roleMiddleware = require("../auth/role.middleware");

router.use(authMiddleware);

// Admin/system: create AI insight
router.post("/", roleMiddleware("admin"), aiController.createInsight);

// Staff/admin: view client insights
router.get("/client/:clientId", aiController.getClientInsights);

// Admin: mark reviewed
router.put("/:id/review", roleMiddleware("admin"), aiController.markReviewed);

module.exports = router;