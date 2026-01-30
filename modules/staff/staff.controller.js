const Staff = require("./staff.model");

module.exports = {
  // Create staff (admin only)
  async createStaff(req, res) {
    try {
      const staff = await Staff.create(req.body);
      return res.status(201).json(staff);
    } catch (err) {
      return res.status(500).json({ message: "Error creating staff", error: err.message });
    }
  },

  // Get all staff
  async getAllStaff(req, res) {
    try {
      const staff = await Staff.find().sort({ createdAt: -1 });
      return res.json(staff);
    } catch (err) {
      return res.status(500).json({ message: "Error fetching staff", error: err.message });
    }
  },

  // Get single staff by ID
  async getStaffById(req, res) {
    try {
      const staff = await Staff.findById(req.params.id);
      if (!staff) return res.status(404).json({ message: "Staff not found" });
      return res.json(staff);
    } catch (err) {
      return res.status(500).json({ message: "Error fetching staff", error: err.message });
    }
  },

  // Update staff
  async updateStaff(req, res) {
    try {
      const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!staff) return res.status(404).json({ message: "Staff not found" });
      return res.json(staff);
    } catch (err) {
      return res.status(500).json({ message: "Error updating staff", error: err.message });
    }
  },

  // Delete staff
  async deleteStaff(req, res) {
    try {
      const staff = await Staff.findByIdAndDelete(req.params.id);
      if (!staff) return res.status(404).json({ message: "Staff not found" });
      return res.json({ message: "Staff deleted" });
    } catch (err) {
      return res.status(500).json({ message: "Error deleting staff", error: err.message });
    }
  },
};