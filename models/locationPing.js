const mongoose = require('mongoose');
const { Schema } = mongoose;

const locationPingSchema = new Schema(
  {
    staff: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    visit: {
      type: Schema.Types.ObjectId,
      ref: 'Visit'
    },

    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    speed: { type: Number }, // km/h or m/s

    status: {
      type: String,
      enum: ['idle', 'driving', 'arrived', 'left'],
      default: 'driving'
    },

    // Time of the ping
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  { timestamps: true }
);

// ✅ Safe export to avoid OverwriteModelError
module.exports = mongoose.models.LocationPing || mongoose.model('LocationPing', locationPingSchema);
