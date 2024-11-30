const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;