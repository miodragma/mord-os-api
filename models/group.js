const Sequelize = require('sequelize');

const sequelize = require('../db/dabatase');

const Group = sequelize.define('group', {
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
  createdBy: {
    type: Sequelize.JSON,
    allowNull: false
  }
});

module.exports = Group;
