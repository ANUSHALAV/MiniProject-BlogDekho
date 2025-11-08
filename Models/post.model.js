const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    postBy :{
        type :mongoose.Schema.Types.ObjectId,
        ref :'user'
    },
    content :String,
    likes : [
        {
            type :mongoose.Schema.Types.ObjectId,
            ref :'user'
        }
    ],
    createdOn :{
        type :Date,
        default :Date.now
    },
    status : {
        type : Number,
        default : 1
    },
});

module.exports = mongoose.model('post',postSchema);