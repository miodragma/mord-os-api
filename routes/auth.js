const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const User = require('../models/user');

const authController = require('../controllers/auth');

router.put('/signup', [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom(value => {
        return User.findOne({ where: { email: value } })
          .then(user => {
            if (user) {
              return Promise.reject('E-Mail address already exists!')
            }
          })
      }).normalizeEmail(),
    body('password').trim().isLength({ min: 5 }),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        const error = new Error('Password confirmation does not match password!')
        error.statusCode = 422;
        throw error;
      }
      return true
    }),
    body('name').trim().isLength({ min: 5 })
  ],
  authController.signup
);

router.post('/login', authController.login);

module.exports = router;
