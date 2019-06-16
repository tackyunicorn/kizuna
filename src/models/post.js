const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema({
    userid: String,
    location: String,
    caption: String,
    private: Boolean,
    timestamp: {
        type: Date,
        default: Date.now
    },
})

const Post = mongoose.model('post', postSchema)

module.exports = Post