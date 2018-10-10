const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
  uid: { // 请求的uid
    type: Number,
    default: 0,
  },
  token: {
    type: String,
    default: '',
  },
  data: {
    type: Object,
    default: '',
  },
  ctime: { // 生成时间
    type: Date,
    default: new Date(),
  },
});