const mongoose = require('mongoose')
const Schema = mongoose.Schema

const followSchema = new Schema({
    userid: String,
    follows: String,
    timestamp: {
        type: Date,
        default: Date.now
    }
})

const Follow = mongoose.model('follow', followSchema)

module.exports = Follow