const express = require('express');
const mongoose = require('mongoose');
const cron = require('cron');
const userRoutes = require('./routes/userRoutes.js');
const userService = require('./services/userService.js');
const { connectToDatabase, dbName } = require('./config/db');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

// Connect to MongoDB
connectToDatabase()
  .then(() => {
    // Schedule the password update job every 5 minutes
    const job = new cron.CronJob('*/2 * * * *', userService.updateAllUserPasswords);
    job.start();

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch((error) => console.error('Error connecting to MongoDB:', error));


