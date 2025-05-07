// src/models/User.js
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class User extends Model {}

User.init({
  uid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
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
    allowNull: true
  },
  is_new: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  average_rating: {
    type: DataTypes.FLOAT,
    allowNull: true
  },

  // campos de auth anteriores
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('member','admin','moderator'),
    allowNull: false,
    defaultValue: 'member'
  },
  twofaEnable: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  twofaSecret: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  identityVerificationStatus: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'Verified'
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: false
});

module.exports = User;
