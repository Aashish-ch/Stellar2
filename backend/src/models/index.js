const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'steller_create',
  logging: false
});

const User = sequelize.define('User', {
  publicKey: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false
  },
  lastLogin: {
    type: Sequelize.DATE
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  }
});

module.exports = {
  sequelize,
  User
};
