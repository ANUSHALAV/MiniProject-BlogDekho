const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/blogDekhoDB')

const userSchema = new mongoose.Schema({
    fullName : String,
    email : String,
    phone : String,
    age :Number,
    password : String
});

module.exports = mongoose.model('user',userSchema);