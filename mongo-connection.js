const mongoose = require('mongoose');
const MONGO_URL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.obq69mi.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log('MongoDB Connected!');
  })
  .catch((err) => {
    console.log(err);
  });
