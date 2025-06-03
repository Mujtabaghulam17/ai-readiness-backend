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

// **MODIFIED CORS CONFIGURATION FOR BETTER PERMISSIVENESS IN LOCAL DEVELOPMENT**
app.use(cors({
  origin: '*', // Allow all origins (be more restrictive in production)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow common methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow common headers
  // credentials: true // Uncomment if you start using cookies or sessions that require credentials
}));

// Parse JSON request bodies
app.use(express.json());

// --- Database Connection Logic ---
// (Using the more robust connection logic we discussed earlier)
async function connectDBAndStartServer() {
    try {
        console.log(`Attempting to connect to MongoDB at ${MONGODB_URI}...`);
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000, // 30 seconds timeout for server selection
            // bufferTimeoutMS: 30000, // Optional: increase command buffering timeout
        });
        console.log("MongoDB connection established successfully.");
        console.log(`Database URI: ${MONGODB_URI}`);

        // Optional: Listen for 'disconnected' or 'error' events after initial connection
        mongoose.connection.on('error', err => {
            console.error('MongoDB runtime error:', err);
        });
        mongoose.connection.on('disconnected', () => {
            console.warn('MongoDB disconnected.');
            // Optionally try to reconnect or handle appropriately
        });

        // Once connected, start the Express server
        app.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}`);
        });

    } catch (err) {
        console.error('ERROR: Initial MongoDB connection failed.');
        console.error(err.message); // Log just the error message for brevity
        console.log('Retrying connection in 5 seconds...');
        // For local dev, retrying can be helpful. In prod, might want to exit or use a proper process manager.
        setTimeout(connectDBAndStartServer, 5000); // Retry after 5 seconds
        // Or exit: process.exit(1);
    }
}


// --- API Routes (Define these before starting the server) ---
app.get('/', (req, res) => { // Basic root route for health check/info
    res.json({ message: 'AI Readiness Backend API is running!' });
});
app.use('/api/results', resultsRouter); // Use the results router for paths starting with /api/results

// --- Simple 404 Handler for routes not found (should be after all valid routes) ---
app.use((req, res, next) => {
    res.status(404).json({ message: 'Resource not found' });
});

// --- Global Error Handler (should be the last piece of middleware) ---
app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err.stack || err);
    res.status(err.status || 500).json({
        message: err.message || 'An unexpected server error occurred.',
        // Optionally include stack trace in development
        // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});


// --- Initiate DB Connection and Server Start ---
connectDBAndStartServer();
