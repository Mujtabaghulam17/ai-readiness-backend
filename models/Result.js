const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: false, // Email is optional based on frontend
      trim: true,
      lowercase: true,
      // Basic email format check (optional, more robust validation might be needed)
      // match: [/\S+@\S+\.\S+/, 'is invalid']
    },
    answers: {
      // Storing answers as a flexible object (Map could also be used)
      // Keys would be question IDs (e.g., "1", "2") and values the scores (1-5)
      type: Object,
      required: [true, 'Scan answers are required.'],
    },
    average: {
      type: Number,
      required: [true, 'Average score is required.'],
      min: [1, 'Average score cannot be less than 1.'],
      max: [5, 'Average score cannot be more than 5.'],
    }
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// Validate that the 'answers' object contains keys 1-5 (or however many questions)
// This is a basic example; you might want more specific validation
resultSchema.path('answers').validate(function(value) {
    if (!value) return false;
    const keys = Object.keys(value);
    const expectedKeys = ['1', '2', '3', '4', '5']; // Assuming 5 questions
    // Check if all expected keys are present and values are numbers 1-5
    return expectedKeys.every(k => keys.includes(k) && typeof value[k] === 'number' && value[k] >= 1 && value[k] <= 5);
}, 'Answers must contain valid scores (1-5) for all questions (IDs 1-5).');


const Result = mongoose.model('Result', resultSchema);

module.exports = Result;
