const db = require('../models');
const Payment = db.Payment;
const Job = db.Job;
const User = db.User; // Might need User if filtering by user later

// Create a new payment record for a job
exports.createPayment = async (req, res) => {
  try {
    const { service_id, amount, status } = req.body;

    if (!service_id || amount === undefined) {
      return res.status(400).json({ error: 'service_id (job uid) and amount are required' });
    }

    // Validate that the job exists
    const job = await Job.findByPk(service_id);
    if (!job) {
      return res.status(404).json({ error: 'Job (service) not found' });
    }

    // Optional: Add logic here to check if payment is allowed (e.g., job status)

    const paymentData = {
      service_id,
      amount,
      status: status || 'processed' // Default status if not provided
    };

    const payment = await Payment.create(paymentData);
    res.status(201).json(payment);
  } catch (error) {
    console.error('Error creating payment:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error while creating payment' });
  }
};

// Get all payments (optional: add filtering)
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
        include: [{ model: Job, as: 'job', attributes: ['uid', 'status'] }] // Include basic job info
    });
    res.status(200).json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get payment by its transaction ID
exports.getPaymentById = async (req, res) => {
  try {
    const { transaction_id } = req.params;
    const payment = await Payment.findByPk(transaction_id, {
        include: [{ model: Job, as: 'job' }] // Include full job details if needed
    });
    if (payment) {
      res.status(200).json(payment);
    } else {
      res.status(404).json({ error: 'Payment not found' });
    }
  } catch (error) {
    console.error('Error fetching payment by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all payments for a specific job ID
exports.getPaymentsByJobId = async (req, res) => {
    try {
        const { job_uid } = req.params;
        const payments = await Payment.findAll({
            where: { service_id: job_uid },
            include: [{ model: Job, as: 'job', attributes: ['uid', 'status'] }]
        });
        // It's okay to return an empty array if a job has no payments
        res.status(200).json(payments);
    } catch (error) {
        console.error('Error fetching payments by job ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update payment status (e.g., mark as refunded)
exports.updatePayment = async (req, res) => {
  try {
    const { transaction_id } = req.params;
    const { status } = req.body; // Only allow updating status for now

    if (!status) {
        return res.status(400).json({ error: 'Status is required for update' });
    }

    const updateData = { status };

    const [updated] = await Payment.update(updateData, {
      where: { transaction_id: transaction_id }
    });

    if (updated) {
      const updatedPayment = await Payment.findByPk(transaction_id);
      res.status(200).json(updatedPayment);
    } else {
      res.status(404).json({ error: 'Payment not found' });
    }
  } catch (error) {
    console.error('Error updating payment:', error);
    if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error while updating payment' });
  }
};

// Delete a payment (Use with caution, usually not recommended)
exports.deletePayment = async (req, res) => {
  try {
    const { transaction_id } = req.params;
    const deleted = await Payment.destroy({
      where: { transaction_id: transaction_id }
    });
    if (deleted) {
      res.status(204).send(); // No Content
    } else {
      res.status(404).json({ error: 'Payment not found' });
    }
  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};