const express = require('express');
const cors = require('cors'); // Import cors
const sequelize = require('./config/database');
const mainRouter = require('./routes'); // This now contains all specific routes
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all origins (adjust for production)
app.use(express.json()); // Parse JSON request bodies

// Basic route for health check
app.get('/', (req, res) => {
  res.send('Service Delivery App Backend is running!');
});

// Mount the main API router under '/api'
app.use('/api', mainRouter);

// Error handling middleware (optional but recommended)
app.use((err, req, res, next) => {
    console.error(err.stack);
    // Avoid sending stack trace in production
    const statusCode = err.statusCode || 500;
    const message = process.env.NODE_ENV === 'production' ? 'Something broke!' : err.message;
    res.status(statusCode).json({ error: message });
});


// Test database connection and start server
async function startServer() {
// ... (resto de la función startServer sin cambios) ...
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    // Sync models - Use with caution in production, consider migrations instead
    // await sequelize.sync({ force: true }); // force: true will drop tables if they exist
    // console.log("All models were synchronized successfully.");

    app.listen(port, () => {
      console.log(`Server listening at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    // Exit process if DB connection fails on startup
    process.exit(1);
  }
}

startServer();

module.exports = app; // Export app if needed for testing