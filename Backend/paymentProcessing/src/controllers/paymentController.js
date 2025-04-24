const paymentService = require('../services/paymentService');

const handlePayment = async (req, res) => {
  const { cost, cardNumber, expMonth, expYear, cvv, serviceId } = req.body;

  // Basic input validation
  if (!cost || !cardNumber || !expMonth || !expYear || !cvv || !serviceId) {
    return res.status(400).json({ message: 'Missing required payment fields' });
  }

  try {
    // Basic validation (should be more robust)
    if (isNaN(parseFloat(cost)) || parseFloat(cost) <= 0) {
        return res.status(400).json({ message: 'Invalid cost amount' });
    }
    if (!/^[0-9]+$/.test(cardNumber) || cardNumber.length < 13 || cardNumber.length > 19) {
        return res.status(400).json({ message: 'Invalid card number' });
    }
    if (!/^[0-9]{1,2}$/.test(expMonth) || parseInt(expMonth) < 1 || parseInt(expMonth) > 12) {
        return res.status(400).json({ message: 'Invalid expiration month' });
    }
    // Assuming year is YY format
    if (!/^[0-9]{2}$/.test(expYear)) {
        return res.status(400).json({ message: 'Invalid expiration year format (YY)' });
    }
    const currentYearLastTwoDigits = new Date().getFullYear() % 100;
    if (parseInt(expYear) < currentYearLastTwoDigits) {
        return res.status(400).json({ message: 'Card expired' });
    }
    if (!/^[0-9]{3,4}$/.test(cvv)) {
        return res.status(400).json({ message: 'Invalid CVV' });
    }

    const paymentResult = await paymentService.processPayment(
      parseFloat(cost),
      cardNumber,
      parseInt(expMonth),
      parseInt(expYear),
      cvv,
      serviceId
    );
    res.status(201).json({ message: 'Payment processed successfully', transaction: paymentResult });
  } catch (error) {
    console.error('Payment processing error:', error.message);
    // Differentiate between validation errors and processing errors
    if (error.message === 'Invalid payment details') {
        return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Payment processing failed', error: error.message });
  }
};

const listPayments = async (req, res) => {
  try {
    const payments = await paymentService.getAllPayments();
    res.status(200).json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error.message);
    res.status(500).json({ message: 'Failed to retrieve payments', error: error.message });
  }
};

module.exports = {
  handlePayment,
  listPayments, // Add the new handler
};