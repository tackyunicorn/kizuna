require('dotenv').config()

const passport = require('passport')
const TwitterStrategy = require('passport-twitter')
const User = require('../models/user')

passport.use(
    new TwitterStrategy({
        // options for the strategy
        consumerKey: process.env.TWITTER_OAUTH_CLIENT_ID,
        consumerSecret: process.env.TWITTER_OAUTH_CLIENT_SECRET,
        callbackURL: process.env.TWITTER_CALLBACK_URL
    }, (accessToken, refreshToken, profile, done) => {
        // check if user already exists
        User.findOne({ twitterid: profile.id }).then((currentUser) => {
            if(currentUser) {
                // already have a user
                console.log('user is: ' + currentUser)
                done(null, currentUser)
            } else {
                // if not, create a user in the db
                new User({
                    username: profile.displayName,
                    twitterid: profile.id,
                    thumbnail: profile._json.profile_image_url_https
                }).save().then((newUser) => {
                    console.log('new user created: ' + newUser)
                    done(null, newUser)
                })
            }
        })
    }
))