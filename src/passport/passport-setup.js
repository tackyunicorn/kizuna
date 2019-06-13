const passport = require('passport')
require('./google-strategy')
require('./facebook-strategy')
require('./twitter-strategy')
require('./instagram-strategy')

const User = require('../models/user')

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user)
    })
})