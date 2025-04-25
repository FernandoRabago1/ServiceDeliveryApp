const express = require('express');
const userRoutes = require('./userRoutes');
// Import other route files here as needed

const router = express.Router();

router.use('/api', userRoutes);
// Mount other routes here

module.exports = router;