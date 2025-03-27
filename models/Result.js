const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
  email: { type: String, required: false },
  answers: { type: Map, of: Number },
  average: Number,
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Result', ResultSchema);
