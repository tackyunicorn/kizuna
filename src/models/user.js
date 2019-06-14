const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: String,
    googleid: String,
    facebookid: String,
    instagramid: String,
    twitterid: String,
    thumbnail: String
})

userSchema.index({
    username: 'text'
})

const User = mongoose.model('user', userSchema)

module.exports = User