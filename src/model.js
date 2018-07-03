var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/hashtag');
let db = mongoose.connection;
exports.db = db;
db.on('error', console.error.bind(console, 'mongodb connection error:'));
db.once('open', function() {
    console.log("Connected to mongo succesfully")
});

var tagscheme = mongoose.Schema({
    name: String,
    count: Number,
    scantime: String,
    parent: String,
    categories: Array
});

exports.HashTag = mongoose.model('hashtag', tagscheme);
