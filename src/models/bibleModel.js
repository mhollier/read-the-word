var mongoose = require('mongoose');

var bibleSchema = mongoose.Schema({
    code: String,
    title: String,
  });

module.exports = mongoose.model('Bible', bibleSchema);