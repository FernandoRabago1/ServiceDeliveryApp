const express = require('express');
const userRoutes = require('./userRoutes');
const postRoutes = require('./postRoutes');
const jobRoutes = require('./jobRoutes');
const reviewRoutes = require('./reviewRoutes');
const paymentRoutes = require('./paymentRoutes');

const router = express.Router();

// Mount specific routes
router.use(userRoutes);
router.use(postRoutes);
router.use(jobRoutes);
router.use(reviewRoutes);
router.use(paymentRoutes);


module.exports = router;