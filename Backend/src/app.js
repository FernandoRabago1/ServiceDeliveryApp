const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const mainRouter = require('./routes'); 

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); 
app.use(express.json()); 

// Basic route for health check
app.get('/', (req, res) => {
  res.send('Service Delivery App Backend is running!');
});

// Mount the main API router under '/api'
app.use('/api', mainRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    const message = process.env.NODE_ENV === 'production' ? 'Something broke!' : err.message;
    res.status(statusCode).json({ error: message });
});


// Function to test database connection and start server
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Start listening only if this module is run directly
    if (require.main === module) {
      app.listen(port, () => {
        console.log(`Server listening at http://localhost:${port}`);
      });
    }

  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1); 
  }
}

// Call startServer only if this module is run directly
if (require.main === module) { 
    startServer();
}


module.exports = app;