// filepath: /Users/andresblanco/Desktop/ISC/2025/Escalables/ServiceDeliveryApp/Backend/src/models/index.js
const sequelize = require('../config/database'); // Necesario para db.sequelize
const User = require('./User');
const Post = require('./Post'); // Importa el modelo Post

// Define associations
User.hasMany(Post, { foreignKey: 'owner_uid', as: 'posts' }); // Un usuario tiene muchos posts
Post.belongsTo(User, { foreignKey: 'owner_uid', as: 'owner' }); // Un post pertenece a un usuario

const db = {
  sequelize, // Exporta la instancia de sequelize
  Sequelize: require('sequelize'), // Exporta la clase Sequelize
  User,
  Post // Exporta el modelo Post
  // Añade otros modelos aquí cuando los crees (Job, Review, Payment)
};

module.exports = db; // Exporta el objeto db completo