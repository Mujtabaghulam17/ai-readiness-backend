require('dotenv').config(); // Load environment variables from .env file (optional for local non-docker runs)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const resultsRouter = require('./routes/results'); // Import the results router

const app = express();

// --- Configuration ---
// Use environment variable for port or default to 3000
const PORT = process.env.PORT || 3000;
// Use environment variable for MongoDB URI (provided by docker-compose)
// Fallback to a standard local MongoDB instance if not running in Docker / env var not set
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/aiReadinessDB_local';

// --- Middleware ---
// Enable Cross-Origin Resource Sharing (adjust options as needed for security)
app.use(cors());
// Parse JSON request bodies
app.use(express.json());

// --- Database Connection ---
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
    console.log(`Successfully connected to MongoDB database.`);
    console.log(`Database URI: ${MONGODB_URI}`); // Log which DB is being used
})
.catch(err => {
    console.error('ERROR: Could not connect to MongoDB.');
    console.error(err);
    process.exit(1); // Exit if DB connection fails on startup
});

mongoose.connection.on('error', err => {
  console.error('MongoDB runtime error:', err);
});

// --- API Routes ---
app.get('/', (req, res) => { // Basic root route for health check/info
    res.json({ message: 'AI Readiness Backend API is running!' });
});
app.use('/api/results', resultsRouter); // Use the results router for paths starting with /api/results

// --- Simple 404 Handler for routes not found ---
app.use((req, res, next) => {
    res.status(404).json({ message: 'Resource not found' });
});

// --- Global Error Handler ---
app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err.stack || err);
    res.status(err.status || 500).json({
        message: err.message || 'An unexpected server error occurred.',
        // Optionally include stack trace in development
        // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});


// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
