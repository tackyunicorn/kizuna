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
    try {
        const post = await Post.findOne({ _id: req.params.id })
        const postUser = await User.findOne({ _id: post.userid })
        res.render('post', {
            user: req.user,
            post,
            postUser
        })
    } catch (e) {
        console.error(e)
    }
})

module.exports = router