const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signup = async (req, res, next) => {

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error
    }

    const { email, password, name } = req.body;

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await new User({
      email,
      password: hashedPassword,
      name
    }).save();

    const newUser = { name: user.name, userId: user.id, email: user.email };
    res.status(201).json({ message: 'User created!', user: newUser })

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }

};

exports.login = async (req, res, next) => {

  try {

    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } })
    if (!user) {
      const error = new Error('A user with this email could not be found');
      error.statusCode = 401;
      throw error;
    }

    const isEqual = await bcrypt.compare(password, user.password)
    if (!isEqual) {
      const error = new Error('Wrong password');
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        email: user.email,
        userId: user.id.toString()
      },
      `${process.env.JWT}`,
      { expiresIn: '1h' });
    const loggedUser = { name: user.name, userId: user.id, token };
    res.status(201).json({ user: loggedUser })

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getUser = async (req, res, next) => {

  try {

    const userId = req.userId;
    const user = await User.findByPk(userId)
    if (!user) {
      const error = new Error('A user with this email could not be found');
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        email: user.email,
        userId: user.id.toString()
      },
      `${process.env.JWT}`,
      { expiresIn: '10000' });
    const loggedUser = { name: user.name, userId: user.id, token };
    res.status(201).json({ user: loggedUser })

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
