const sequelize = require('../config/database');
const User = require('./User');
const Post = require('./Post');
const Job = require('./Job');
const Review = require('./Review');
const Payment = require('./Payment');

// --- Define associations ---

// User <-> Post
User.hasMany(Post, { foreignKey: 'owner_uid', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'owner_uid', as: 'owner' });

// User <-> Job
User.hasMany(Job, { foreignKey: 'buyer_uid', as: 'boughtJobs' });
User.hasMany(Job, { foreignKey: 'dooer_uid', as: 'workedJobs' });
Job.belongsTo(User, { foreignKey: 'buyer_uid', as: 'buyer' });
Job.belongsTo(User, { foreignKey: 'dooer_uid', as: 'dooer' });

// User <-> Review
User.hasMany(Review, { foreignKey: 'reviewer_uid', as: 'writtenReviews' }); // Reviews written by user
User.hasMany(Review, { foreignKey: 'reviewed_uid', as: 'receivedReviews' }); // Reviews received by user
Review.belongsTo(User, { foreignKey: 'reviewer_uid', as: 'reviewer' });
Review.belongsTo(User, { foreignKey: 'reviewed_uid', as: 'reviewedUser' });

// Job <-> Review
Job.hasOne(Review, { foreignKey: 'job_uid', as: 'review' }); // Un Job tiene una Review
Review.belongsTo(Job, { foreignKey: 'job_uid', as: 'job' }); // Una Review pertenece a un Job

// Job <-> Payment
Job.hasMany(Payment, { foreignKey: 'service_id', sourceKey: 'uid', as: 'payments' });
Payment.belongsTo(Job, { foreignKey: 'service_id', targetKey: 'uid', as: 'job' });


const db = {
  sequelize,
  Sequelize: require('sequelize'),
  User,
  Post,
  Job,
  Review,
  Payment
};

module.exports = db;