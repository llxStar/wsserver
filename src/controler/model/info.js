const dbserver = require('../../dbserver/index');
const mongoose = dbserver.mongoose;

const infoSchema = require('./schema/info');
const infoModel = mongoose.model('info', infoSchema, 'info');

module.exports = infoModel;

