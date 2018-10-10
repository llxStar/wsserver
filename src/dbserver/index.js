const mongoose = require('mongoose');
const config = require('./config');

mongoose.connect(config.connect);
const db = mongoose.connection;

module.exports = {
  db,
  mongoose,
};
