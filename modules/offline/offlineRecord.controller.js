/**
 * -----------------------------------------------------
 * CONTROLLER: Offline Sync
 * ROLE: Handle offline actions created by staff when
 *       no internet is available. Syncs them when online.
 *
 * AUTHOR: Amna Idris + PrismCare AI Assistant
 * DATE: 2026
 * -----------------------------------------------------
 */

const OfflineRecord = require("./offlineRecord.model");
const Visit = require("../visits/visit.model");
const MAR = require("../mar/mar.model");
const Note = require("../notes/notes.model");
const Wellbeing = require("../wellbeing/wellbeing.model");
const GPSLog = require("../gps/gpslog.model");

module.exports = {
  // STAFF: SAVE OFFLINE ACTION
  async saveOffline(req, res) {
    try {
      const staffId = req.user.staffId;
      const { type, payload, deviceInfo } = req.body;

      const record = await OfflineRecord.create({
        staffId,
        type,
        payload,
        deviceInfo,
      });

      return res.status(201).json(record);
    } catch (err) {
      return res.status(500).json({
        message: "Error saving offline record",
        error: err.message,
      });
    }
  },

  // STAFF: SYNC OFFLINE RECORDS
  async syncOffline(req, res) {
    try {
      const staffId = req.user.staffId;

      const records = await OfflineRecord.find({ staffId, synced: false }).sort({
        offlineTimestamp: 1,
      });

      const results = [];

      for (const record of records) {
        let result;

        switch (record.type) {
          case "visit":
            result = await Visit.create(record.payload);
            break;
          case "mar":
            result = await MAR.create(record.payload);
            break;
          case "note":
            result = await Note.create(record.payload);
            break;
          case "wellbeing":
            result = await Wellbeing.create(record.payload);
            break;
          case "document":
            result = { message: "Document sync placeholder" };
            break;
          default:
            result = { error: "Unknown offline type" };
        }

        record.synced = true;
        record.syncedAt = new Date();
        await record.save();

        results.push({
          recordId: record._id,
          type: record.type,
          result,
        });
      }

      return res.json({
        message: "Offline sync completed",
        synced: results.length,
        results,
      });
    } catch (err) {
      return res.status(500).json({
        message: "Error syncing offline records",
        error: err.message,
      });
    }
  },

  // ADMIN: VIEW UNSYNCED RECORDS
  async getPendingOffline(req, res) {
    try {
      const records = await OfflineRecord.find({ synced: false })
        .populate("staffId", "firstName lastName")
        .sort({ offlineTimestamp: 1 });

      return res.json(records);
    } catch (err) {
      return res.status(500).json({
        message: "Error fetching offline records",
        error: err.message,
      });
    }
  },
};
