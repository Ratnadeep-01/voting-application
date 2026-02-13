const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI =
  process.env.MONGODB_URI;

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

module.exports = mongoose;