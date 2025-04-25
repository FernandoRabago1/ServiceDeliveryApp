const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class User extends Model {}

User.init({
  uid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: true // Assuming name can be optional initially
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false, // Email is required
    unique: true,
    validate: {
      isEmail: true
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  is_worker: {
    type: DataTypes.BOOLEAN,
    allowNull: true // Or set a default value if appropriate
  },
  is_new: {
    type: DataTypes.BOOLEAN,
    allowNull: true // Or set a default value
  },
  average_rating: {
    type: DataTypes.FLOAT,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: false // Disable Sequelize's default timestamps if using 'created_at' manually
});

module.exports = User;