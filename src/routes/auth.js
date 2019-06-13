const router = require('express').Router()
const passport = require('passport')

require('../passport/passport-setup')

// auth login
router.get('/login', (req, res) => {
    if (req.user) {
        res.redirect('/profile/feed')
    } else {
        res.render('login', { user: req.user })
    }
})

// auth logout
router.get('/logout', (req, res) => {
    // handle with passport
    req.logout()
    res.redirect('/')
})

// auth with google
router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}))

// callback route for google to redirect to
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    res.redirect('/profile/feed')
})

// auth with facebook
router.get('/facebook', passport.authenticate('facebook'))

// callback route for facebook to redirect to
router.get('/facebook/redirect', passport.authenticate('facebook'), (req, res) => {
    res.redirect('/profile/feed')
})

// auth with twitter
router.get('/twitter', passport.authenticate('twitter'))

// callback route for twitter to redirect to
router.get('/twitter/redirect', passport.authenticate('twitter'), (req, res) => {
    res.redirect('/profile/feed')
})

module.exports = router