const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = new Schema({
    postid: String,
    userid: String,
    comment: String,
    timestamp: {
        type: Date,
        default: Date.now
    }
})

const Comment = mongoose.model('comment', commentSchema)

module.exports = Comment