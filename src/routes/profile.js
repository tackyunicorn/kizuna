const router = require('express').Router()

const Post = require('../models/post')

const authCheck = (req, res, next) => {
    if (!req.user) {
        // if user is not logged in
        res.redirect('/auth/login')
    } else {
        // if logged in
        next()
    }
}

router.get('/', authCheck, async (req, res) => {
    try {
        const posts = await Post.find({
            userid: req.user.id
        }).sort({
            timestamp: -1
        }).limit(10)
        res.render('profile', {
            user: req.user,
            self: true,
            posts
        })
    } catch (e) {
        console.error(e)
    }
})

router.get('/feed', authCheck, (req, res) => {
    res.render('feed', {
        user: req.user
    })
})

module.exports = router