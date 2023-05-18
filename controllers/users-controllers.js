const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

const getUsers = async (req, res, next) => {
  let allUsers;

  try {
    allUsers = await User.find({}, '-password');
  } catch (error) {
    return next(error);
  }

  if (!allUsers.length) {
    const error = new HttpError('There is no user yet', 404);
    return next(error);
  }

  res.json({ users: allUsers });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs are passed', 422));
  }

  const { name, email, password } = req.body;

  let isExistingUser;

  try {
    isExistingUser = await User.findOne({ email: email });
  } catch (error) {
    return next(error);
  }

  if (isExistingUser) {
    const error = new HttpError('User exists already', 422);
    return next(error);
  }

  let createdUser;
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      'Could not create the user, please try again.',
      500
    );
    return next(error);
  }

  try {
    createdUser = await new User({
      name,
      email,
      image: req.file.path,
      password: hashedPassword,
      places: [],
    });
  } catch (error) {
    return next(error);
  }

  try {
    await createdUser.save();
  } catch (error) {
    return next(error);
  }

  res.status(201).json({ user: createdUser });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let identifiedUser;

  try {
    identifiedUser = await User.findOne({
      email: email,
    });
  } catch (error) {
    return next(error);
  }

  if (!identifiedUser) {
    const error = new HttpError('Could not identify the user', 401);
    return next(error);
  }

  let comparePassword;

  try {
    comparePassword = await bcrypt.compare(password, identifiedUser.password);
  } catch (err) {
    const error = new HttpError('Could not log in, please try again', 500);
    return next(error);
  }

  if (!comparePassword) {
    const error = new HttpError('Password does not match.', 401);
    return next(error);
  }

  res.json({
    message: 'Logged in!',
    user: identifiedUser.toObject({ getters: true }),
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
