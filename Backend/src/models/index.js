const sequelize = require('../config/database');
const User = require('./User');
const Post = require('./Post');
const Job = require('./Job'); // Importa el modelo Job
// Import Review and Payment models here when created
// const Review = require('./Review');
// const Payment = require('./Payment');

// --- Define associations ---

// User <-> Post
User.hasMany(Post, { foreignKey: 'owner_uid', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'owner_uid', as: 'owner' });

// User <-> Job
// Un usuario puede comprar muchos trabajos
User.hasMany(Job, { foreignKey: 'buyer_uid', as: 'boughtJobs' });
// Un usuario puede realizar muchos trabajos
User.hasMany(Job, { foreignKey: 'dooer_uid', as: 'workedJobs' });
// Un trabajo pertenece a un comprador
Job.belongsTo(User, { foreignKey: 'buyer_uid', as: 'buyer' });
// Un trabajo pertenece a un realizador (dooer)
Job.belongsTo(User, { foreignKey: 'dooer_uid', as: 'dooer' });

// Job <-> Review (Define when Review model exists)
// Job.belongsTo(Review, { foreignKey: 'review_uid', as: 'review' });
// Review.hasOne(Job, { foreignKey: 'review_uid', as: 'job' });

// Job <-> Payment (Define when Payment model exists)
// Job.hasMany(Payment, { foreignKey: 'service_id', sourceKey: 'uid', as: 'payments' }); // Assuming service_id refers to job.uid
// Payment.belongsTo(Job, { foreignKey: 'service_id', targetKey: 'uid', as: 'job' });


const db = {
  sequelize,
  Sequelize: require('sequelize'),
  User,
  Post,
  Job // Exporta el modelo Job
  // Review, // Export Review when created
  // Payment // Export Payment when created
};

module.exports = db;