const Document = require("./document.model");

module.exports = {
  // -----------------------------------------------------
  // UPLOAD DOCUMENT
  // -----------------------------------------------------
  async uploadDocument(req, res) {
    try {
      const payload = {
        ...req.body,
        uploadedBy: req.user._id,
      };

      // Auto-mark expired if expiryDate < today
      if (payload.expiryDate) {
        const expiry = new Date(payload.expiryDate);
        if (expiry < new Date()) {
          payload.isExpired = true;
        }
      }

      const doc = await Document.create(payload);
      return res.status(201).json(doc);
    } catch (err) {
      return res.status(500).json({
        message: "Error uploading document",
        error: err.message,
      });
    }
  },

  // -----------------------------------------------------
  // GET DOCUMENTS FOR A CLIENT (with filters)
  // -----------------------------------------------------
  async getClientDocuments(req, res) {
    try {
      const { clientId } = req.params;
      const { category, expired } = req.query;

      const query = { clientId };

      // Filter by category
      if (category) {
        query.category = category;
      }

      // Filter by expiry status
      if (expired === "true") {
        query.isExpired = true;
      }
      if (expired === "false") {
        query.isExpired = false;
      }

      const docs = await Document.find(query)
        .sort({ createdAt: -1 })
        .populate("uploadedBy", "email role");

      // Auto-update expiry status on fetch
      for (const doc of docs) {
        if (doc.expiryDate && doc.expiryDate < new Date() && !doc.isExpired) {
          doc.isExpired = true;
          await doc.save();
        }
      }

      return res.json(docs);
    } catch (err) {
      return res.status(500).json({
        message: "Error fetching documents",
        error: err.message,
      });
    }
  },

  // -----------------------------------------------------
  // DELETE DOCUMENT
  // -----------------------------------------------------
  async deleteDocument(req, res) {
    try {
      const doc = await Document.findByIdAndDelete(req.params.id);
      if (!doc) {
        return res.status(404).json({ message: "Document not found" });
      }
      return res.json({ message: "Document deleted" });
    } catch (err) {
      return res.status(500).json({
        message: "Error deleting document",
        error: err.message,
      });
    }
  },

  // -----------------------------------------------------
  // GET EXPIRING DOCUMENTS (Admin Dashboard)
  // -----------------------------------------------------
  async getExpiringDocuments(req, res) {
    try {
      const today = new Date();

      const docs = await Document.find({
        expiryDate: { $exists: true },
      }).sort({ expiryDate: 1 });

      const expiringSoon = docs.filter((doc) => {
        if (!doc.expiryDate) return false;

        const expiry = new Date(doc.expiryDate);
        const warningDate = new Date(
          expiry.getTime() - doc.expiryWarningDays * 24 * 60 * 60 * 1000
        );

        return today >= warningDate && today <= expiry;
      });

      return res.json(expiringSoon);
    } catch (err) {
      return res.status(500).json({
        message: "Error fetching expiring documents",
        error: err.message,
      });
    }
  },
};