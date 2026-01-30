const AuditLog = require("./auditLog.model");

module.exports = {
  async getEntityAudit(req, res) {
    try {
      const logs = await AuditLog.find({
        entityType: req.params.entityType,
        entityId: req.params.entityId,
      })
        .populate("userId")
        .sort({ createdAt: -1 });

      return res.json(logs);
    } catch (err) {
      return res.status(500).json({ message: "Error fetching audit logs", error: err.message });
    }
  },

  async getUserAudit(req, res) {
    try {
      const logs = await AuditLog.find({ userId: req.params.userId })
        .sort({ createdAt: -1 });
      return res.json(logs);
    } catch (err) {
      return res.status(500).json({ message: "Error fetching user audit logs", error: err.message });
    }
  },
};