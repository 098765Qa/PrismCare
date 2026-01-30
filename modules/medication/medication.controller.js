const Medication = require("./medication.model");

module.exports = {
  async createMedication(req, res) {
    try {
      const med = await Medication.create(req.body);
      return res.status(201).json(med);
    } catch (err) {
      return res.status(500).json({ message: "Error creating medication", error: err.message });
    }
  },

  async getClientMedications(req, res) {
    try {
      const meds = await Medication.find({ clientId: req.params.clientId });
      return res.json(meds);
    } catch (err) {
      return res.status(500).json({ message: "Error fetching medications", error: err.message });
    }
  },

  async updateMedication(req, res) {
    try {
      const med = await Medication.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!med) return res.status(404).json({ message: "Medication not found" });
      return res.json(med);
    } catch (err) {
      return res.status(500).json({ message: "Error updating medication", error: err.message });
    }
  },

  async deleteMedication(req, res) {
    try {
      const med = await Medication.findByIdAndDelete(req.params.id);
      if (!med) return res.status(404).json({ message: "Medication not found" });
      return res.json({ message: "Medication deleted" });
    } catch (err) {
      return res.status(500).json({ message: "Error deleting medication", error: err.message });
    }
  },
};