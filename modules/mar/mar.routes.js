/**
 * -----------------------------------------------------
 * ROUTES: MAR
 * -----------------------------------------------------
 */

const express = require("express");
const router = express.Router();

const { createMAR, getClientMAR, deleteMAR } = require("./mar.controller");

// Create MAR entry
router.post("/", createMAR);

// Get MAR entries for a client
router.get("/client/:clientId", getClientMAR);

// Delete MAR entry
router.delete("/:id", deleteMAR);

module.exports = router;