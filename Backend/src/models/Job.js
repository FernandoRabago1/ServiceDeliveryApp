const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Job extends Model {}

Job.init({
  uid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  buyer_uid: { // Foreign key referencing User (buyer)
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'uid'
    }
  },
  dooer_uid: { // Foreign key referencing User (dooer)
    type: DataTypes.UUID,
    allowNull: true, // Can be null initially
    references: {
      model: 'users',
      key: 'uid'
    }
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'pending', // Default status when created
    validate: {
      isIn: [['pending', 'accepted', 'in_progress', 'completed', 'cancelled']]
    }
  },
  scheduled_time: {
    type: DataTypes.DATE, // Corresponds to TIMESTAMP
    allowNull: true
  },
  review_uid: { // Foreign key referencing Review
    type: DataTypes.UUID,
    allowNull: true,
    // We'll add references later when the Review model exists
    // references: {
    //   model: 'review', // Table name for reviews
    //   key: 'uid'
    // }
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'Job',
  tableName: 'jobs',
  timestamps: false // Using manual created_at
});

module.exports = Job;