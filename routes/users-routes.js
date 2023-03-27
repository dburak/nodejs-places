const router = require('express').Router();
const { check } = require('express-validator');
const usersControllers = require('../controllers/users-controllers');

router.get('/', usersControllers.getUsers);

router.post(
  '/signup',
  [check('title').not().isEmpty(), check('email').normalizeEmail().isEmail()],
  usersControllers.signup
);

router.post('/login', usersControllers.login);

module.exports = router;
