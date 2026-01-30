const express = require("express");
const router = express.Router();

const documentController = require("./document.controller");
const authMiddleware = require("../auth/auth.middleware");
const roleMiddleware = require("../auth/role.middleware");

// All document routes require authentication
router.use(authMiddleware);

// Upload document (admin + staff)
router.post("/", documentController.uploadDocument);

// Get documents for a client (admin + staff)
router.get("/client/:clientId", documentController.getClientDocuments);

// Get expiring documents (admin only)
router.get(
  "/expiring",
  roleMiddleware("admin"),
  documentController.getExpiringDocuments
);

// Delete document (admin only)
router.delete(
  "/:id",
  roleMiddleware("admin"),
  documentController.deleteDocument
);

module.exports = router;