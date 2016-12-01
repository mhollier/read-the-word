var mongoose = require('mongoose');

var verseSchema = mongoose.Schema({
  bible: String,
  book: String,
  chapter: Number,
  verse: Number,
  verseText: String,
  index: Number,
});

module.exports = mongoose.model('Verse', verseSchema);