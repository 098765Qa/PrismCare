const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  fileName: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// ✅ Safe export
module.exports = mongoose.models.Document || mongoose.model('Document', documentSchema);
