const { validationResult } = require('express-validator');
const { Op } = require("sequelize");

const User = require('../models/user');
const Group = require('../models/group');
const UsersGroups = require('../models/users-groups');

exports.getMembersByGroupId = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await User.findByPk(userId);

    if (!user) {
      const error = new Error('User could not be found');
      error.statusCode = 401;
      throw error;
    }

    const groupId = req.params.groupId;
    const group = await Group.findByPk(groupId);

    if (!group) {
      const error = new Error(`Group with id ${groupId} not exist!`);
      error.statusCode = 404;
      throw error;
    }

    const groupUsers = await Group.findOne({
      where: { id: groupId },
      include: {
        model: User,
        through: { attributes: [] },
        attributes: { exclude: ['createdAt', 'updatedAt', 'password'] }
      },
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });

    res.status(200).json({ groupUsers });

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Failed"
    }
    next(err);
  }
};

exports.findMemberByEmail = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await User.findByPk(userId);

    if (!user) {
      const error = new Error('User could not be found');
      error.statusCode = 401;
      throw error;
    }

    const email = req.params.email;

    const users = await User.findAll({
      where: { email: { [Op.like]: `%${email}%` } },
      include: { model: Group, through: { attributes: [] } },
      attributes: { exclude: ['password', 'updatedAt'] }
    });

    res.status(200).json({ users });

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Failed"
    }
    next(err);
  }

};

exports.addNewUserToGroup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Request failed.');
      error.statusCode = 404;
      error.data = errors.array();
      throw error
    }

    const userId = req.userId;
    const user = await User.findByPk(userId);

    if (!user) {
      const error = new Error('User could not be found');
      error.statusCode = 401;
      throw error;
    }

    const groupId = req.body.groupId;
    const group = await Group.findByPk(groupId);

    if (!group) {
      const error = new Error(`Group with id ${groupId} not exist!`);
      error.statusCode = 404;
      throw error;
    }

    const usersToAddIds = req.body.userIds;

    const users = usersToAddIds.map(id => ({
      userId: id,
      groupId: group.id
    }));

    await UsersGroups.bulkCreate(users);

    res.status(200).json({ message: "Successfully added user/s" });

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Failed"
    }
    next(err);
  }
};

exports.deleteUserFromGroup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Request failed.');
      error.statusCode = 404;
      error.data = errors.array();
      throw error
    }

    const userId = req.userId;
    const user = await User.findByPk(userId);

    if (!user) {
      const error = new Error('User could not be found');
      error.statusCode = 401;
      throw error;
    }

    const groupId = req.body.groupId;
    const group = await Group.findByPk(groupId);

    if (!group) {
      const error = new Error(`Group with id ${groupId} not exist!`);
      error.statusCode = 404;
      throw error;
    }

    const usersIds = req.body.userIds;
    const usersToDeleteIds = [...usersIds].filter(id => id !== userId);

    await UsersGroups.destroy({ where: { userId: usersToDeleteIds, groupId } });

    res.status(200).json({ message: "Successfully removed user/s" });

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Failed"
    }
    next(err);
  }
};
