const router = require('express').Router();
const { check } = require('express-validator');
const usersControllers = require('../controllers/users-controllers');
const fileUpload = require('../middleware/image-upload');

router.get('/', usersControllers.getUsers);

router.post(
  '/signup',
  fileUpload.single('image'),
  [check('name').not().isEmpty(), check('email').normalizeEmail().isEmail()],
  usersControllers.signup
);

router.post('/login', usersControllers.login);

module.exports = router;
