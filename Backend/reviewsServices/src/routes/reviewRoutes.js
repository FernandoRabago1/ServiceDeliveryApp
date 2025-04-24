const express = require('express');
const router = express.Router();
const controller = require('../controllers/reviewController');

router.post('/', controller.createReview);
router.get('/service/:serviceId', controller.getReviewsByService);
router.get('/user/:userId', controller.getReviewsByUser);

module.exports = router;
