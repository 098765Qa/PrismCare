const express = require("express");
const router = express.Router();

const medicationController = require("./medication.controller");
const authMiddleware = require("../auth/auth.middleware");
const roleMiddleware = require("../auth/role.middleware");

router.use(authMiddleware);

// Admin: manage meds
router.post("/", roleMiddleware("admin"), medicationController.createMedication);
router.put("/:id", roleMiddleware("admin"), medicationController.updateMedication);
router.delete("/:id", roleMiddleware("admin"), medicationController.deleteMedication);

// Staff: view client meds
router.get("/client/:clientId", medicationController.getClientMedications);

module.exports = router;