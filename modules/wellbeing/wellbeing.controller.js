/**
 * -----------------------------------------------------
 * CONTROLLER: Wellbeing
 * ROLE: Handle daily wellbeing checks recorded by staff,
 *       including mood, hydration, nutrition, pain,
 *       sleep, behaviour, safeguarding, and notes.
 *
 * AUTHOR: Amna Idris + PrismCare AI Assistant
 * DATE: 2026
 * -----------------------------------------------------
 */

const WellbeingCheck = require("./wellbeing.model");
const Client = require("../clients/client.model");
const Staff = require("../staff/staff.model");

module.exports = {
  // -----------------------------------------------------
  // STAFF: CREATE WELLBEING CHECK
  // -----------------------------------------------------
  async createWellbeing(req, res) {
    try {
      const staffId = req.user.staffId;

      const {
        clientId,
        mood,
        hydration,
        nutrition,
        pain,
        sleep,
        behaviour,
        safeguarding,
        notes,
        createdOffline,
        offlineRecordId,
      } = req.body;

      // Validate client exists
      const client = await Client.findById(clientId);
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }

      // Create wellbeing entry
      const wellbeing = await WellbeingCheck.create({
        clientId,
        staffId,
        mood,
        hydration,
        nutrition,
        pain,
        sleep,
        behaviour,
        safeguarding,
        notes,
        createdOffline,
        offlineRecordId,
      });

      return res.status(201).json(wellbeing);
    } catch (err) {
      return res.status(500).json({
        message: "Error creating wellbeing check",
        error: err.message,
      });
    }
  },

  // -----------------------------------------------------
  // STAFF + ADMIN: GET WELLBEING FOR CLIENT
  // -----------------------------------------------------
  async getClientWellbeing(req, res) {
    try {
      const { clientId } = req.params;

      const entries = await WellbeingCheck.find({ clientId })
        .populate("staffId", "firstName lastName")
        .sort({ createdAt: -1 });

      return res.json(entries);
    } catch (err) {
      return res.status(500).json({
        message: "Error fetching wellbeing checks",
        error: err.message,
      });
    }
  },

  // -----------------------------------------------------
  // ADMIN: DELETE WELLBEING ENTRY
  // -----------------------------------------------------
  async deleteWellbeing(req, res) {
    try {
      const entry = await WellbeingCheck.findByIdAndDelete(req.params.id);

      if (!entry) {
        return res.status(404).json({ message: "Wellbeing entry not found" });
      }

      return res.json({ message: "Wellbeing entry deleted" });
    } catch (err) {
      return res.status(500).json({
        message: "Error deleting wellbeing entry",
        error: err.message,
      });
    }
  },
};