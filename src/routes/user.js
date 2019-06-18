const router = require('express').Router()

const User = require('../models/user')
const Post = require('../models/post')
const Follow = require('../models/follow')

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
        const foundUser = await User.findOne({
            _id: req.params.id
        })
        const posts = await Post.find({
            userid: req.params.id,
            private: false
        }).sort({
            timestamp: -1
        }).limit(60)
        res.render('profile', {
            user: req.user,
            foundUser,
            self: false,
            posts,
        })
    } catch (e) {
        console.error(e)
    }
})

router.get('/:id/follow-status', authCheck, async (req, res) => {
    try {
        var follow = await Follow.findOne({
            userid: req.user.id,
            follows: req.params.id
        })
        if (follow === null) {
            follow = "follow"
        } else {
            follow = "unfollow"
        }
        res.send({
            follow
        })
    } catch (e) {
        console.error(e)
    }
})

router.get('/:id/follow-unfollow', authCheck, async (req, res) => {
    try {
        var follow = await Follow.findOne({
            userid: req.user.id,
            follows: req.params.id
        })
        var message
        if (follow === null) {
            const newFollow = await Follow({
                userid: req.user.id,
                follows: req.params.id
            }).save()
            message = "user followed!"
            follow = "unfollow"
        } else {
            const newUnFollow = await Follow.deleteOne({
                userid: req.user.id,
                follows: req.params.id
            })
            message = "user unfollowed :("
            follow = "follow"
        }
        res.send({
            follow,
            message
        })
    } catch (e) {
        console.error(e)
    }
})

module.exports = router