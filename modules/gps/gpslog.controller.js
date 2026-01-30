const GPSLog = require('./gpslog.model');

module.exports = {
  // Create a GPS log
  async createGPSLog(req, res) {
    try {
      const log = await GPSLog.create(req.body);
      return res.status(201).json(log);
    } catch (err) {
      return res.status(500).json({ message: 'Error creating GPS log', error: err.message });
    }
  },

  // Get all GPS logs for a staff member
  async getStaffLogs(req, res) {
    try {
      const staffId = req.params.staffId;
      const logs = await GPSLog.find({ staffId }).sort({ timestamp: -1 });
      return res.json(logs);
    } catch (err) {
      return res.status(500).json({ message: 'Error fetching staff GPS logs', error: err.message });
    }
  },

  // Get GPS logs for a specific visit
  async getVisitLogs(req, res) {
    try {
      const visitId = req.params.visitId;
      const logs = await GPSLog.find({ visitId }).sort({ timestamp: 1 });
      return res.json(logs);
    } catch (err) {
      return res.status(500).json({ message: 'Error fetching visit GPS logs', error: err.message });
    }
  },

  // Delete a GPS log
  async deleteGPSLog(req, res) {
    try {
      const log = await GPSLog.findByIdAndDelete(req.params.id);
      if (!log) return res.status(404).json({ message: 'GPS log not found' });
      return res.json({ message: 'GPS log deleted' });
    } catch (err) {
      return res.status(500).json({ message: 'Error deleting GPS log', error: err.message });
    }
  },
};
