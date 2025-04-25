// filepath: /Users/andresblanco/Desktop/ISC/2025/Escalables/ServiceDeliveryApp/Backend/src/models/Post.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Post extends Model {}

Post.init({
  uid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: true // O false si el título es obligatorio
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: true // O false si el cuerpo es obligatorio
  },
  owner_uid: { // Foreign key referencing User
    type: DataTypes.UUID,
    allowNull: false, // Asumiendo que un post siempre debe tener un dueño
    references: {
      model: 'users', // Nombre de la tabla referenciada
      key: 'uid'      // Clave primaria de la tabla referenciada
    }
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  cost: {
    type: DataTypes.FLOAT, // O DataTypes.DECIMAL si necesitas precisión exacta
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'Post',
  tableName: 'posts',
  timestamps: false // Deshabilitado porque tienes created_at manualmente
});

module.exports = Post;