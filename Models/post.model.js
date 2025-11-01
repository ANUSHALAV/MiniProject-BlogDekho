const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    content :String,
    likes : Object,
    createdBy : Object,
    createdOn : Date,
});

module.exports = mongoose.model('post',postSchema);