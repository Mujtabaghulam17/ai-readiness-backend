const express = require('express');
const Result = require('../models/Result'); // Adjust path if your structure differs

const router = express.Router();

// --- POST /api/results ---
// Endpoint to receive and save new scan results
router.post('/', async (req, res, next) => { // Added next for error handling
  try {
    console.log('Received POST request to /api/results');
    console.log('Request Body:', req.body);

    // Basic validation before creating the model instance
    if (!req.body.answers || !req.body.average) {
       return res.status(400).json({ message: 'Missing required fields: answers and average.' });
    }

    // Create a new document using the Result model and request body
    const newResult = new Result({
        email: req.body.email, // Will be null/undefined if not provided
        answers: req.body.answers,
        average: req.body.average,
    });

    // Attempt to save the new document to the database
    const savedResult = await newResult.save();

    console.log('Result saved successfully:', savedResult._id);

    // Send a success response back to the client
    res.status(201).json({
      message: 'Scan results saved successfully!',
      resultId: savedResult._id, // Send back the ID of the created document
      data: savedResult // Optionally send back the full saved document
    });

  } catch (error) {
    // Handle potential errors during save (e.g., validation errors)
    console.error('Error saving scan result:', error);

    // If it's a Mongoose validation error, send a more specific message
    if (error.name === 'ValidationError') {
        // Extract validation messages (optional, can be complex)
        const messages = Object.values(error.errors).map(e => e.message);
        return res.status(400).json({
            message: 'Validation failed. Please check your input.',
            errors: messages // Provide specific validation errors
        });
    }

    // For other errors, pass to the global error handler in server.js
    next(error); // Let the global error handler manage it
  }
});

// --- GET /api/results (Optional Example) ---
// Endpoint to retrieve all scan results (you might want pagination/filtering later)
router.get('/', async (req, res, next) => {
    try {
        console.log('Received GET request to /api/results');
        const results = await Result.find() // Find all documents
                                   .sort({ createdAt: -1 }); // Sort by newest first

        res.status(200).json({
            count: results.length,
            data: results
        });
    } catch (error) {
        console.error('Error fetching results:', error);
        next(error); // Pass error to global handler
    }
});


module.exports = router;
