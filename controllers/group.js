const User = require('../models/user');
const Group = require('../models/group');
const UsersGroups = require('../models/users-groups');

exports.createGroup = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await User.findByPk(userId)
    if (!user) {
      const error = new Error('User could not be found');
      error.statusCode = 401;
      throw error;
    }

    const { name } = req.body;

    const group = await Group.build({
      name,
      createdBy: {
        userId: user.id,
        name: user.name,
        email: user.email
      }
    }).save();

    await UsersGroups.build({
      userId,
      groupId: group.id
    }).save();

    res.status(201).json({ message: 'Group created', group });

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Failed"
    }
    next(err);
  }
};

exports.getUserGroupsById = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await User.findByPk(userId);

    if (!user) {
      const error = new Error('User could not be found');
      error.statusCode = 401;
      throw error;
    }

    const userGroups = await User.findOne({
      where: { id: userId },
      include: { model: Group, through: { attributes: [] } },
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
    });

    res.status(200).json({ message: "Fetch successfully", userGroups: userGroups ?? [] })

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Failed"
    }
    next(err);
  }
};

exports.deleteGroupById = async (req, res, next) => {
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

    if (group.createdBy.userId !== +userId) {
      const error = new Error("You don't have permission to delete this group!");
      error.statusCode = 403;
      throw error;
    }

    await group.destroy();

    res.status(200).json({ message: 'Group deleted', group });

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Failed"
    }
    next(err);
  }
};
