const router = require('express').Router()

const User = require('../models/user')
const Post = require('../models/post')
const Comment = require('../models/comment')
const Like = require('../models/like')

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
        const post = await Post.findOne({
            _id: req.params.id
        })
        const postUser = await User.findOne({
            _id: post.userid
        })
        res.render('post', {
            user: req.user,
            post,
            postUser
        })
    } catch (e) {
        console.error(e)
    }
})

router.get('/:id/fetch-comments', authCheck, async (req, res) => {
    try {
        const comments = await Comment.aggregate([{
            $match: {
                postid: req.params.id
            }
        }, {
            $project: {
                _id: 0,
                comment: 1,
                timestamp: 1,
                userid: {
                    $toObjectId: '$userid'
                }
            }
        }, {
            $lookup: {
                from: 'users',
                localField: 'userid',
                foreignField: '_id',
                as: 'userinfo'
            }
        }, {
            $project: {
                comment: 1,
                timestamp: 1,
                userinfo: {
                    $arrayElemAt: [
                        '$userinfo', 0
                    ]
                }
            }
        }, {
            $sort: {
                'timestamp': -1
            }
        }])
        res.send({
            comments
        })
    } catch (e) {
        console.error(e)
    }
})

router.post('/:id/add-comment', authCheck, async (req, res) => {
    try {
        var comment = req.body.newComment
        var userinfo = await User.findOne({
            _id: req.user.id
        })
        await Comment({
            postid: req.params.id,
            userid: req.user.id,
            comment
        }).save()
        res.send({
            userinfo,
            message: "comment added!"
        })
    } catch (e) {
        console.error(e)
    }
})

router.get('/:id/like-count', authCheck, async (req, res) => {
    try {
        var likeCount = await Like.countDocuments({
            likes: req.params.id
        })
        if (likeCount == 1) {
            likeCount = likeCount + ' like'
        } else {
            likeCount = likeCount + ' likes'
        }
        res.send({
            likeCount
        })
    } catch (e) {
        console.error(e)
    }
})

router.get('/:id/like-status', authCheck, async (req, res) => {
    try {
        var like = await Like.findOne({
            userid: req.user.id,
            likes: req.params.id
        })
        if (like === null) {
            like = false
        } else {
            like = true
        }
        res.send({
            like
        })
    } catch (e) {
        console.error(e)
    }
})

router.get('/:id/like-unlike', authCheck, async (req, res) => {
    try {
        var like = await Like.findOne({
            userid: req.user.id,
            likes: req.params.id
        })
        var message
        if (like === null) {
            const newLike = await Like({
                userid: req.user.id,
                likes: req.params.id
            }).save()
            message = "post liked!"
            like = true
        } else {
            const newUnLike = await Like.deleteOne({
                userid: req.user.id,
                likes: req.params.id
            })
            message = "post unliked :("
            like = false
        }
        res.send({
            like,
            message
        })
    } catch (e) {
        console.error(e)
    }
})

router.get('/:id/like-list', authCheck, async (req, res) => {
    try {
        var likeList = await Like.aggregate([{
            $match: {
                likes: req.params.id
            }
        }, {
            $project: {
                _id: 0,
                timestamp: 1,
                userid: {
                    $toObjectId: '$userid'
                }
            }
        }, {
            $lookup: {
                from: 'users',
                localField: 'userid',
                foreignField: '_id',
                as: 'userinfo'
            }
        }, {
            $project: {
                timestamp: 1,
                userinfo: {
                    $arrayElemAt: [
                        '$userinfo', 0
                    ]
                }
            }
        }, {
            $sort: {
                timestamp: -1
            }
        }])
        res.send({
            likeList
        })
    } catch (e) {
        console.error(e)
    }
})

module.exports = router