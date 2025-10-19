const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName : String,
    email : String,
    phone : String,
    age :Number,
    password : String
});

module.exports = mongoose.model('user',userSchema);