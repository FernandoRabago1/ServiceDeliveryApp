const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class Message extends Model {}

Message.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  senderId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'sender_id',
    references: { model: 'users', key: 'uid' }
  },
  receiverId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'receiver_id',
    references: { model: 'users', key: 'uid' }
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_read'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  }
}, {
  sequelize,
  modelName: 'Message',
  tableName: 'messages',
  timestamps: false
});

module.exports = Message;
