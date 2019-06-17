const router = require('express').Router()

const User = require('../models/user')
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

router.get('/:id', authCheck, async (req, res) => {
    if (req.user.id == req.params.id) {
        return res.redirect('/profile/')
    }
    try {
        const foundUser = await User.find({ _id: req.params.id })
        const posts = await Post.find({
            userid: req.params.id,
            private: false
        }).sort({
            timestamp: -1
        }).limit(60)
        res.render('profile', {
            user: req.user,
            foundUser: foundUser[0],
            self: false,
            posts
        })
    } catch (e) {
        console.error(e)
    }
})

module.exports = router