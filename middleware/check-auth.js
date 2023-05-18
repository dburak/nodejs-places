const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'

    const decodedToken = jwt.verify(token, 'super_secret');

    req.userData = { userId: decodedToken.userId };
    next();

    if (!token) {
      throw new Error('Authenticated failed.');
    }
  } catch (err) {
    const error = new HttpError('Authenticated failed.', 401);
    return next(error);
  }
};
