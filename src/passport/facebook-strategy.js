require('dotenv').config()

const passport = require('passport')
const FacebookStrategy = require('passport-facebook')
const User = require('../models/user')

passport.use(
    new FacebookStrategy({
        // options for the strategy
        clientID: process.env.FACEBOOK_OAUTH_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_OAUTH_CLIENT_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL
    }, (accessToken, refreshToken, profile, done) => {
        // check if user already exists
        User.findOne({ facebookid: profile.id }).then((currentUser) => {
            if(currentUser) {
                // already have a user
                console.log('user is: ' + currentUser)
                done(null, currentUser)
            } else {
                // if not, create a user in the db
                new User({
                    username: profile.displayName,
                    facebookid: profile.id,
                    thumbnail: 'https://graph.facebook.com/' + profile.id + '/picture?type=large'
                }).save().then((newUser) => {
                    console.log('new user created: ' + newUser)
                    done(null, newUser)
                })
            }
        })
    }
))