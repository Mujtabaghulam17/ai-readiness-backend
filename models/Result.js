const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema(
  {
    email: { type: String, required: false },
    answers: { type: mongoose.Schema.Types.Mixed, required: true },
    average: { type: Number, required: true },
  },
  { strict: false } // ← laat alles toe
);

module.exports = mongoose.model('Result', resultSchema);
