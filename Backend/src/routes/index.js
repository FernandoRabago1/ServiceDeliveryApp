const express = require('express');
const userRoutes = require('./userRoutes');
const postRoutes = require('./postRoutes');
const jobRoutes = require('./jobRoutes'); // Import job routes
// Import other route files here as needed (reviews, payments)
// const reviewRoutes = require('./reviewRoutes');
// const paymentRoutes = require('./paymentRoutes');

const router = express.Router();

// Mount specific routes
router.use(userRoutes); // Mounted under /api/users/* etc.
router.use(postRoutes); // Mounted under /api/posts/* etc.
router.use(jobRoutes);  // Mounted under /api/jobs/* etc.
// Mount other routes here
// router.use(reviewRoutes);
// router.use(paymentRoutes);


module.exports = router;