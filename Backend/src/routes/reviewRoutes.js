const express = require('express');
const reviewController = require('../controllers/reviewController');

const router = express.Router();

// Route to create a new review
router.post('/reviews', reviewController.createReview);

// Route to get all reviews
router.get('/reviews', reviewController.getAllReviews);

// Route to get a review by its ID
router.get('/reviews/:uid', reviewController.getReviewById);

// Route to get the review associated with a specific job ID
router.get('/jobs/:job_uid/review', reviewController.getReviewByJobId);

module.exports = router;