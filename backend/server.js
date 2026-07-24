import app from './app.js';
import db from './config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 CareerTwin AI Backend server running on http://localhost:${PORT} [${process.env.NODE_ENV || 'development'}]`);
});

// Graceful Shutdown Handler
const gracefulShutdown = (signal) => {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log('HTTP server closed.');
    db.close((err) => {
      if (err) {
        console.error('Error closing SQLite database:', err.message);
      } else {
        console.log('SQLite database connection closed.');
      }
      process.exit(0);
    });
  });
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
