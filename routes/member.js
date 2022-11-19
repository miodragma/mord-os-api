const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const isAuth = require('../middleware/is-auth');

const memberController = require('../controllers/member');

router.put('/user-group/add', [
  isAuth,
  body('userIds').not().isEmpty(),
  body('groupId').not().isEmpty()
], memberController.addNewUserToGroup);
router.delete('/user-group/delete', [
  isAuth,
  body('userIds').not().isEmpty(),
  body('groupId').not().isEmpty()
], memberController.deleteUserFromGroup);
router.get('/group/:groupId', isAuth, memberController.getMembersByGroupId);
router.get('/search/:email', isAuth, memberController.findMemberByEmail);

module.exports = router;
