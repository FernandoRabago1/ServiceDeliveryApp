const express = require('express');
const userRoutes = require('./userRoutes');
const postRoutes = require('./postRoutes'); // Import post routes
// Import other route files here as needed (jobs, reviews, payments)
// const jobRoutes = require('./jobRoutes');
// const reviewRoutes = require('./reviewRoutes');
// const paymentRoutes = require('./paymentRoutes');

const router = express.Router();

// Mount specific routes (without '/api' prefix here)
router.use(userRoutes); // Will be mounted under /api/users/*
router.use(postRoutes); // Will be mounted under /api/posts/*
// Mount other routes here
// router.use(jobRoutes);
// router.use(reviewRoutes);
// router.use(paymentRoutes);


module.exports = router;