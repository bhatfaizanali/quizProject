require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const quizzesRouter = require('./routes/quizzes');

const app = express();
app.use(express.json());

// Avoid buffering mongoose operations indefinitely when DB is not available.
// This prevents long "buffering timed out" errors and surfaces failures quickly.
mongoose.set('bufferCommands', false);

// Basic health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Mount API routes
app.use('/api/quizzes', quizzesRouter);

// Connect to MongoDB if provided
const MONGO_URI = process.env.MONGO_URI || '';
if (MONGO_URI) {
  mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Mongo connection error:', err));
} else {
  console.log('No MONGO_URI provided. Running without DB connection (DB routes will return 503).');
}

// Log mongoose connection errors and provide clearer guidance
mongoose.connection.on('error', err => {
  console.error('Mongoose connection error:', err && err.message ? err.message : err);
  if (err && err.codeName === 'CommandNotFound') {
    console.error('The MongoDB server responded with CommandNotFound. This usually means the connection string is pointing to an unsupported endpoint (for example, an Atlas Data API / SQL endpoint) rather than a normal MongoDB server. Ensure you are using the standard MongoDB connection string (mongodb:// or mongodb+srv://) from Atlas -> Connect -> "Connect your application" and include credentials.');
  }
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection at:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
