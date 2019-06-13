require('dotenv').config()

const passport = require('passport')
const InstagramStrategy = require('passport-instagram')
const User = require('../models/user')

passport.use(
    new InstagramStrategy({
        // options for the strategy
        clientID: process.env.INSTAGRAM_OAUTH_CLIENT_ID,
        clientSecret: process.env.INSTAGRAM_OAUTH_CLIENT_SECRET,
        callbackURL: process.env.INSTAGRAM_CALLBACK_URL
    }, (accessToken, refreshToken, profile, done) => {
        // check if user already exists
        User.findOne({ instagramid: profile.id }).then((currentUser) => {
            if(currentUser) {
                // already have a user
                console.log('user is: ' + currentUser)
                done(null, currentUser)
            } else {
                // if not, create a user in the db
                new User({
                    username: profile.displayName,
                    instagramid: profile.id,
                    thumbnail: profile._json.data.profile_picture
                }).save().then((newUser) => {
                    console.log('new user created: ' + newUser)
                    done(null, newUser)
                })
            }
        })
    }
))