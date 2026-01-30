/**
 * -----------------------------------------------------
 * HOOKS: AI Engine
 * ROLE: Automatically trigger AI analysis when:
 *       - Visit ends
 *       - MAR entry created
 *       - Wellbeing entry created
 *
 * AUTHOR: Amna Idris + PrismCare AI Assistant
 * -----------------------------------------------------
 */

const axios = require("axios");

module.exports = {
  async onVisitCompleted(visitId) {
    try {
      await axios.post(`${process.env.BASE_URL}/ai/summary/visit/${visitId}`);
    } catch (err) {
      console.error("AI Visit Hook Error:", err.message);
    }
  },

  async onMedicationEntry(marId) {
    try {
      await axios.post(`${process.env.BASE_URL}/ai/risk/mar/${marId}`);
    } catch (err) {
      console.error("AI MAR Hook Error:", err.message);
    }
  },

  async onWellbeingEntry(wbId) {
    try {
      await axios.post(`${process.env.BASE_URL}/ai/summary/wellbeing/${wbId}`);
    } catch (err) {
      console.error("AI Wellbeing Hook Error:", err.message);
    }
  },
};