const CarePlan = require("./careplan.model");
const RiskAssessment = require("./riskAssessment.model");
const SupportNeeds = require("./supportNeeds.model");

module.exports = {
  async getClientCareBundle(req, res) {
    try {
      const { clientId } = req.params;

      const [carePlan, risks, supportNeeds] = await Promise.all([
        CarePlan.findOne({ clientId }),
        RiskAssessment.findOne({ clientId }),
        SupportNeeds.findOne({ clientId }),
      ]);

      return res.json({ carePlan, risks, supportNeeds });
    } catch (err) {
      return res.status(500).json({ message: "Error fetching care bundle", error: err.message });
    }
  },

  async upsertCarePlan(req, res) {
    try {
      const { clientId } = req.params;
      const payload = { ...req.body, clientId };

      const plan = await CarePlan.findOneAndUpdate(
        { clientId },
        payload,
        { upsert: true, new: true }
      );

      return res.json(plan);
    } catch (err) {
      return res.status(500).json({ message: "Error saving care plan", error: err.message });
    }
  },

  async upsertRiskAssessment(req, res) {
    try {
      const { clientId } = req.params;
      const payload = { ...req.body, clientId };

      const risk = await RiskAssessment.findOneAndUpdate(
        { clientId },
        payload,
        { upsert: true, new: true }
      );

      return res.json(risk);
    } catch (err) {
      return res.status(500).json({ message: "Error saving risk assessment", error: err.message });
    }
  },

  async upsertSupportNeeds(req, res) {
    try {
      const { clientId } = req.params;
      const payload = { ...req.body, clientId };

      const support = await SupportNeeds.findOneAndUpdate(
        { clientId },
        payload,
        { upsert: true, new: true }
      );

      return res.json(support);
    } catch (err) {
      return res.status(500).json({ message: "Error saving support needs", error: err.message });
    }
  },
};