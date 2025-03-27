const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema(
  {
    email: String,
    answers: mongoose.Schema.Types.Mixed, // ← laat elk JSON toe
    average: Number,
  },
  { strict: false } // ← belangrijk: laat extra velden toe
);

module.exports = mongoose.model('Result', resultSchema);
