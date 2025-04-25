const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Review extends Model {}

Review.init({
  uid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  job_uid: { // Foreign key referencing Job
    type: DataTypes.UUID,
    allowNull: false, // A review must be linked to a job
    references: {
      model: 'jobs',
      key: 'uid'
    }
  },
  reviewer_uid: { // Foreign key referencing User (who wrote the review)
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'uid'
    }
  },
  reviewed_uid: { // Foreign key referencing User (who received the review)
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'uid'
    }
  },
  rating: {
    type: DataTypes.INTEGER, // Or FLOAT if you allow half-stars, etc.
    allowNull: false,
    validate: {
      min: 1,
      max: 5 // Assuming a 1-5 star rating
    }
  },
  review_text: {
    type: DataTypes.TEXT,
    allowNull: true // Review text can be optional
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'Review',
  tableName: 'review', // Matches your init.sql table name
  timestamps: false // Using manual created_at
});

module.exports = Review;