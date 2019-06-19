const mongoose = require('mongoose')
const Schema = mongoose.Schema

const likeSchema = new Schema({
    userid: String,
    likes: String,
    timestamp: {
        type: Date,
        default: Date.now
    }
})

const Like = mongoose.model('like', likeSchema)

module.exports = Like