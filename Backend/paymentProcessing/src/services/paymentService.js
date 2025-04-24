const db = require('../models/payment');
const { v4: uuidv4 } = require('uuid');

// Basic validation (replace with a real validation library or logic)
const validatePaymentDetails = (cardNumber, expMonth, expYear, cvv) => {
  // Simple checks - enhance these significantly for production
  return cardNumber && cardNumber.length >= 13 && cardNumber.length <= 19 &&
         expMonth && expMonth >= 1 && expMonth <= 12 &&
         expYear && expYear >= new Date().getFullYear() % 100 && // Check year (last two digits)
         cvv && cvv.length >= 3 && cvv.length <= 4;
};

const processPayment = async (cost, cardNumber, expMonth, expYear, cvv, serviceId) => {
  if (!validatePaymentDetails(cardNumber, expMonth, expYear, cvv)) {
    throw new Error('Invalid payment details');
  }

  // In a real scenario, interact with a payment gateway here
  console.log(`Processing payment of ${cost} for service ${serviceId}`);

  const transactionId = uuidv4();
  const status = 'processed'; // Assume success for now

  try {
    const queryText = 'INSERT INTO payments(transaction_id, service_id, amount, status) VALUES($1, $2, $3, $4) RETURNING *';
    const values = [transactionId, serviceId, cost, status];
    const res = await db.query(queryText, values);
    console.log('Payment recorded:', res.rows[0]);
    return res.rows[0];
  } catch (err) {
    console.error('Error saving payment to DB:', err);
    // Decide how to handle DB errors - maybe mark transaction as failed?
    throw new Error('Failed to record payment');
  }
};

const getAllPayments = async () => {
  try {
    const queryText = 'SELECT * FROM payments ORDER BY created_at DESC';
    const res = await db.query(queryText);
    return res.rows;
  } catch (err) {
    console.error('Error fetching payments from DB:', err);
    throw new Error('Failed to retrieve payments');
  }
};

module.exports = {
  processPayment,
  getAllPayments, // Export the new function
};