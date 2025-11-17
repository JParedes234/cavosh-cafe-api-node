 
const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const User = sequelize.define('User', {
  fullName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false }, // Texto plano
  resetCode: { type: DataTypes.STRING(6) },
  resetCodeExpiry: { type: DataTypes.DATE },
  points: { type: DataTypes.INTEGER, defaultValue: 0 }
});

module.exports = User;