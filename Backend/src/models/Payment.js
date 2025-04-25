const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Payment extends Model {}

Payment.init({
  transaction_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  service_id: { // Foreign key referencing Job (using service_id as column name)
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'jobs', // Table name for jobs
      key: 'uid'     // Primary key of jobs table
    }
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2), // Matches DECIMAL(10, 2) in SQL
    allowNull: false,
    validate: {
      isDecimal: true,
      min: 0 // Amount cannot be negative
    }
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false, // Make status required
    defaultValue: 'processed',
    validate: {
      isIn: [['processed', 'pending', 'failed', 'refunded']] // Example statuses
    }
  },
  created_at: {
    type: DataTypes.DATE, // Use DATE instead of DATEONLY if you need time
    defaultValue: DataTypes.NOW // Use NOW for timestamp
  }
}, {
  sequelize,
  modelName: 'Payment',
  tableName: 'payments',
  timestamps: false // Using manual created_at
});

module.exports = Payment;