const express = require('express');
const paymentController = require('../controllers/paymentController');

const router = express.Router();

router.post('/', paymentController.handlePayment);
router.get('/', paymentController.listPayments); // Add GET route

module.exports = router;