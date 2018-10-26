const mongoose = require('mongoose');
const config = require('../config');

mongoose.connect(config.db.connect);
const db = mongoose.connection;

module.exports = {
  db,
  mongoose,
};
