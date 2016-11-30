var mongoose = require('mongoose');

var bookSchema = mongoose.Schema({
    code: String,
    abbr: String,
    title: String,
    testament: String,
    seq: Number,
    category: String,
    chapters: Number
});
module.exports = mongoose.model("Book", bookSchema);
