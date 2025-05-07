// src/models/index.js
// Centraliza modelos, funciones y asociaciones

const { sequelize } = require('../config/database');
const { Sequelize } = require('sequelize');

// Importación de definición de modelos Sequelize
const User = require('./User');
const Post = require('./Post');
const Job = require('./Job');
const Review = require('./Review');
const Payment = require('./Payment');
const Message = require('./Message');

// Importación de funciones heredadas de user.model
const userModel = require('./user.model');

// Definir asociaciones entre modelos

// User <-> Post
User.hasMany(Post, { foreignKey: 'owner_uid', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'owner_uid', as: 'owner' });

// User <-> Job
User.hasMany(Job, { foreignKey: 'buyer_uid', as: 'boughtJobs' });
User.hasMany(Job, { foreignKey: 'dooer_uid', as: 'workedJobs' });
Job.belongsTo(User, { foreignKey: 'buyer_uid', as: 'buyer' });
Job.belongsTo(User, { foreignKey: 'dooer_uid', as: 'dooer' });

// User <-> Review
User.hasMany(Review, { foreignKey: 'reviewer_uid', as: 'writtenReviews' });
User.hasMany(Review, { foreignKey: 'reviewed_uid', as: 'receivedReviews' });
Review.belongsTo(User, { foreignKey: 'reviewer_uid', as: 'reviewer' });
Review.belongsTo(User, { foreignKey: 'reviewed_uid', as: 'reviewedUser' });

// Job <-> Review
Job.hasOne(Review, { foreignKey: 'job_uid', as: 'review' });
Review.belongsTo(Job, { foreignKey: 'job_uid', as: 'job' });

// Job <-> Payment
Job.hasMany(Payment, { foreignKey: 'service_id', sourceKey: 'uid', as: 'payments' });
Payment.belongsTo(Job, { foreignKey: 'service_id', targetKey: 'uid', as: 'job' });

User.hasMany(Message, { foreignKey: 'senderId',   as: 'sentMessages'     });
User.hasMany(Message, { foreignKey: 'receiverId', as: 'receivedMessages' });
Message.belongsTo(User, { foreignKey: 'senderId',   as: 'sender'           });
Message.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver'         });

// Construir objeto de exportación
const db = {
  sequelize,
  Sequelize,

  // Modelos
  User,
  Post,
  Job,
  Review,
  Payment,
  Message,
  ...userModel
};

module.exports = db;
