const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const fileController = require('../controllers/file');

const isAuth = require('../middleware/is-auth');

const createOdEditValidation = [
  isAuth,
  body('name').trim().notEmpty()
];

/* Create file */
router.put('/create', createOdEditValidation, fileController.createOrUpdateFile);

/* Get files by userId or groupId */
router.get('/user-files', isAuth, fileController.getFilesById);
router.get('/group/:groupId', isAuth, fileController.getFilesById);

/* Edit file */
router.post('/edit/:fileId', createOdEditValidation, fileController.createOrUpdateFile);

/* Delete file */
router.delete('/delete/:fileId', isAuth, fileController.deleteFile);

module.exports = router;
