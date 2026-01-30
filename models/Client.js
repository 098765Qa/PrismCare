const mongoose = require('mongoose');

const gpSchema = new mongoose.Schema({ name: String, phone: String, address: String });
const medicalHistoryEntrySchema = new mongoose.Schema({ condition: String, notes: String, recordedAt: { type: Date, default: Date.now }, recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } });

const clientSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: Date,
  phone: String,
  email: String,
  addressLine1: String,
  addressLine2: String,
  city: String,
  postcode: String,
  keySafeCode: String,
  accessNotes: String,
  gp: gpSchema,
  medicalHistory: [medicalHistoryEntrySchema],
  assignedStaff: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.models.Client || mongoose.model('Client', clientSchema);
