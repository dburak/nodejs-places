const mongoose = require('mongoose');
const MONGO_URL =
  'mongodb+srv://burakkddiker:bd123456@cluster0.obq69mi.mongodb.net/places_test?retryWrites=true&w=majority';

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log('MongoDB Connected!');
  })
  .catch((err) => {
    console.log(err);
  });
