const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/blogDekhoDB')

const userSchema = new mongoose.Schema({
    fullName : String,
    email : String,
    phone : String,
    age :Number,
    password : String,
    status :{
        type : Number,
        default : 1
    },
    posts : [
        {
            type :mongoose.Schema.Types.ObjectId,
            ref :'post'
        }
    ]
});

module.exports = mongoose.model('user',userSchema);