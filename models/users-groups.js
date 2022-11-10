const sequelize = require('../db/dabatase');

const UsersGroups = sequelize.define('users_groups', {});

module.exports = UsersGroups;
