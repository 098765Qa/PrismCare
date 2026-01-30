// modules/ai/ai.model.js
const mongoose = require('mongoose');

const AISchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: false },
  sourceType: { type: String, enum: ['visit', 'wellbeing', 'mar', 'trend', 'chat'], default: 'chat' },
  sourceId: { type: mongoose.Schema.Types.ObjectId, required: false },
  summary: { type: String },
  riskScore: { type: Number, default: 0 },
  riskLevel: { type: String, enum: ['low','medium','high'], default: 'low' },
  anomalies: { type: [String], default: [] },
  predictions: { type: Object },
  createdAt: { type: Date, default: Date.now }
});

const AIEngine = mongoose.model('AIEngine', AISchema);

module.exports = { AIEngine };
