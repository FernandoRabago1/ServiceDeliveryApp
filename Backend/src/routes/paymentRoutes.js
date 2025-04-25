const express = require('express');
const paymentController = require('../controllers/paymentController');

const router = express.Router();

// Route to create a new payment
router.post('/payments', paymentController.createPayment);

// Route to get all payments
router.get('/payments', paymentController.getAllPayments);

// Route to get a payment by its transaction ID
router.get('/payments/:transaction_id', paymentController.getPaymentById);

// Route to get all payments associated with a specific job ID
router.get('/jobs/:job_uid/payments', paymentController.getPaymentsByJobId);

// Route to update payment status
router.put('/payments/:transaction_id', paymentController.updatePayment);

// Route to delete a payment (use cautiously)
router.delete('/payments/:transaction_id', paymentController.deletePayment);

module.exports = router;