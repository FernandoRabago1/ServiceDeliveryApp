const express = require('express');
const sequelize = require('./config/database');
const mainRouter = require('./routes');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Mount the main router
app.use('/', mainRouter);

// Test database connection and start server
async function startServer() {
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
  }
}

startServer();