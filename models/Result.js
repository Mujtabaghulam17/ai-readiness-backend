const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  email: { type: String, required: false },
  answers: { type: mongoose.Schema.Types.Mixed, required: true },
  average: { type: Number, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Result', resultSchema);
