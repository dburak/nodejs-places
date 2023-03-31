const express = require('express');
const HttpError = require('./models/http-error');
const morgan = require('morgan')

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');

require('./mongo-connection');

const app = express();

app.use(express.json());
app.use(morgan('dev'))

app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);

app.use(() => {
  throw new HttpError('Could not find this route', 404);
});

app.use((error, req, res, next) => {
  if (res.headersSent) { //should be plural
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || 'An unknown error occurred.' });
});

app.listen(8802);
