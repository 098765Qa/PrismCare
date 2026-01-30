const express = require("express");
const router = express.Router();

const clientController = require("./client.controller");
const authMiddleware = require("../auth/auth.middleware");
const roleMiddleware = require("../auth/role.middleware");

router.use(authMiddleware);

// Admin + staff: full client management
router.post("/", roleMiddleware("admin"), clientController.createClient);
router.get("/", clientController.getAllClients);
router.get("/:id", clientController.getClientById);
router.put("/:id", roleMiddleware("admin"), clientController.updateClient);
router.delete("/:id", roleMiddleware("admin"), clientController.deleteClient);

module.exports = router;