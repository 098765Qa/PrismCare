const express = require("express");
const router = express.Router();

const noteController = require('./notes.controller');
const authMiddleware = require("../auth/auth.middleware");
const roleMiddleware = require("../auth/role.middleware");

// All note routes require authentication
router.use(authMiddleware);

// Staff: create note
router.post("/", noteController.createNote);

// Staff + Admin: get notes for a client
router.get("/client/:clientId", noteController.getClientNotes);

// Admin: delete note
router.delete("/:id", roleMiddleware("admin"), noteController.deleteNote);

module.exports = router;
