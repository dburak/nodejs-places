const express = require('express');
const HttpError = require('./models/http-error');
const morgan = require('morgan');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');

require('./mongo-connection');

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));
app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);

app.use(() => {
  throw new HttpError('Could not find this route', 404);
});

app.use((error, req, res, next) => {
  if (req.file) {
    // multer file deletion if any error
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headersSent) {
    //should be plural, Boolean (read-only). True if headers were sent, false otherwise.
    return next(error); //Pass errors to Express.
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || 'An unknown error occurred.' });
});

app.listen(8802);
