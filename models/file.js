const Sequelize = require('sequelize');

const sequelize = require('../db/dabatase');

const File = sequelize.define('file', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  value: {
    type: Sequelize.STRING,
    allowNull: true
  }
});

module.exports = File;
