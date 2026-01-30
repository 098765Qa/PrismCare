const mongoose = require("mongoose");

const GPSLogSchema = new mongoose.Schema(
  {
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true },
    visitId: { type: mongoose.Schema.Types.ObjectId, ref: "Visit" },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    accuracy: { type: Number },
    timestamp: { type: Date, default: Date.now },
    recordedOffline: { type: Boolean, default: false },
    offlineRecordId: { type: mongoose.Schema.Types.ObjectId, ref: "OfflineRecord" },
  },
  { timestamps: true }
);

GPSLogSchema.index({ staffId: 1, timestamp: -1 });
GPSLogSchema.index({ visitId: 1 });

module.exports = mongoose.models.GPSLog || mongoose.model("GPSLog", GPSLogSchema);
