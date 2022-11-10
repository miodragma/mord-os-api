const User = require('../models/user');
const File = require('../models/file');

const { validationResult } = require('express-validator');

exports.getFilesById = async (req, res, next) => {
  try {

    const userId = req.userId;
    const user = await User.findByPk(userId)
    if (!user) {
      const error = new Error('User could not be found');
      error.statusCode = 401;
      throw error;
    }

    const groupId = req.params.groupId;
    let files;

    if (!groupId) {
      files = await File.findAll({ where: { userId, groupId: null }, attributes: { exclude: ['createdAt'] } });
    } else {
      files = await File.findAll({ where: { groupId } });
    }

    res.status(200).json(files);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Failed"
    }
    next(err);
  }
};

exports.createOrUpdateFile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Create file failed.');
      error.statusCode = 404;
      error.data = errors.array();
      throw error
    }

    const userId = req.userId;
    const user = await User.findByPk(userId)
    if (!user) {
      const error = new Error('User could not be found');
      error.statusCode = 401;
      throw error;
    }

    const { name, value, groupId } = req.body;
    const fileId = req.params.fileId;

    let file;

    if (fileId) {
      file = await File.findByPk(fileId)

      file.name = name;
      file.value = value;
      file.userId = userId;
      file.groupId = groupId;

      await file.save();
    } else {
      file = await new File({
        name,
        value,
        userId,
        groupId
      }).save();
    }

    const message = fileId ? 'File updated successfully' : 'File created successfully';
    res.status(201).json({ message, file })

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Failed"
    }
    next(err);
  }
};

exports.deleteFile = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await User.findByPk(userId)

    if (!user) {
      const error = new Error('User could not be found');
      error.statusCode = 401;
      throw error;
    }

    const fileId = req.params.fileId;
    const file = await File.findByPk(fileId);

    if (!file) {
      const error = new Error(`File with id ${fileId} not exist!`);
      error.statusCode = 404;
      throw error;
    }

    if (file.userId !== +userId) {
      const error = new Error("You don't have permission to delete this file!");
      error.statusCode = 403;
      throw error;
    }

    await file.destroy()

    res.status(200).json({ message: 'File deleted', file });

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Failed"
    }
    next(err);
  }
};
