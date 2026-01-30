const AIInsight = require("./aiInsights.model");

module.exports = {
  async createInsight(req, res) {
    try {
      const insight = await AIInsight.create(req.body);
      return res.status(201).json(insight);
    } catch (err) {
      return res.status(500).json({ message: "Error creating AI insight", error: err.message });
    }
  },

  async getClientInsights(req, res) {
    try {
      const insights = await AIInsight.find({ clientId: req.params.clientId })
        .sort({ createdAt: -1 });
      return res.json(insights);
    } catch (err) {
      return res.status(500).json({ message: "Error fetching insights", error: err.message });
    }
  },

  async markReviewed(req, res) {
    try {
      const insight = await AIInsight.findByIdAndUpdate(
        req.params.id,
        { reviewed: true, reviewedAt: new Date(), reviewedBy: req.user._id },
        { new: true }
      );
      return res.json(insight);
    } catch (err) {
      return res.status(500).json({ message: "Error reviewing insight", error: err.message });
    }
  },
};