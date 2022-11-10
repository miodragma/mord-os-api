const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const isAuth = require('../middleware/is-auth');

const groupController = require('../controllers/group');

const createValidation = [
  isAuth,
  body('name').trim().notEmpty()
];

router.put('/create', createValidation, groupController.createGroup)
router.get('/user-groups', isAuth, groupController.getUserGroupsById)
router.delete('/delete/:groupId', isAuth, groupController.deleteGroupById)

module.exports = router;
