const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    passwordHash: { type: String, required: true },

    role: {
      type: String,
      enum: ["admin", "staff", "client"],
      required: true,
    },

    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
    },

    status: {
      type: String,
      enum: ["active", "suspended", "locked"],
      default: "active",
    },

    loginHistory: [
      {
        timestamp: { type: Date, default: Date.now },
        ip: String,
        userAgent: String,
        device: String,
        success: Boolean,
      },
    ],

    lastActive: { type: Date },

    devices: [
      {
        deviceId: String,
        model: String,
        os: String,
        lastUsed: Date,
      },
    ],
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 });

// ✅ SAFE EXPORT (prevents OverwriteModelError)
module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
