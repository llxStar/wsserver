const infoModel = require('./model/info');

function save(obj, cb) {
  const info = new infoModel(obj);
  info.save(cb || function () {});
}

function del(condition, cb) {
  infoModel.remove(condition, cb)
}

function update(conditions, update, cb) {
  infoModel.update(conditions, {
    $set: update.set
  }, cb)
}

function find(condition, cb) { // 这个api还有很多，需要更详细的开发，与其他语句分开
  infoModel.find(condition, cb)
}

module.exports = {
  save,
  del,
  update,
  find,
};