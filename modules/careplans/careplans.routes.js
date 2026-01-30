const express = require("express");
const router = express.Router();

const careplansController = require("./careplans.controller");
const authMiddleware = require("../auth/auth.middleware");
const roleMiddleware = require("../auth/role.middleware");

router.use(authMiddleware);

// Admin + staff: view full bundle
router.get("/client/:clientId", careplansController.getClientCareBundle);

// Admin: edit core care planning docs
router.put("/client/:clientId/careplan", roleMiddleware("admin"), careplansController.upsertCarePlan);
router.put("/client/:clientId/risk", roleMiddleware("admin"), careplansController.upsertRiskAssessment);
router.put("/client/:clientId/support-needs", roleMiddleware("admin"), careplansController.upsertSupportNeeds);

module.exports = router;