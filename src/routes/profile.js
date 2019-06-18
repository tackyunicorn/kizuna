const router = require('express').Router()

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

router.get('/', authCheck, async (req, res) => {
    try {
        const posts = await Post.find({
            userid: req.user.id
        }).sort({
            timestamp: -1
        }).limit(60)
        res.render('profile', {
            user: req.user,
            self: true,
            posts
        })
    } catch (e) {
        console.error(e)
    }
})

router.get('/feed', authCheck, async (req, res) => {
    try {
        const feed = await Follow.aggregate([{
            $match: {
                userid: req.user.id
            }
        }, {
            $project: {
                _id: 0,
                follows: 1,
                timestamp: 1,
                follows: {
                    $toObjectId: '$follows'
                }
            }
        }, {
            $lookup: {
                from: 'users',
                localField: 'follows',
                foreignField: '_id',
                as: 'userinfo'
            }
        }, {
            $project: {
                follows: 1,
                timestamp: 1,
                userinfo: {
                    $arrayElemAt: [
                        '$userinfo', 0
                    ]
                },
                follows: {
                    $toString: '$follows'
                }
            }
        }, {
            $lookup: {
                from: 'posts',
                localField: 'follows',
                foreignField: 'userid',
                as: 'posts'
            }
        }, {
            $unwind: {
                path: '$posts',
                preserveNullAndEmptyArrays: true
            }
        }, {
            $project: {
                userinfo: 1,
                timestamp: 1,
                posts: {
                    $ifNull: [
                        "$posts", {
                            private: false
                        }
                    ]
                }
            }
        }, {
            $match: {
                'posts.private': false
            }
        }, {
            $sort: {
                'posts.timestamp': -1
            }
        }, {
            $group: {
                _id: '$userinfo._id',
                timestamp: {
                    $push: '$timestamp'
                },
                userinfo: {
                    $push: '$userinfo'
                },
                posts: {
                    $push: '$posts'
                }
            }
        }, {
            $project: {
                _id: 0,
                userinfo: {
                    $arrayElemAt: [
                        '$userinfo', 0
                    ]
                },
                timestamp: {
                    $arrayElemAt: [
                        '$timestamp', 0
                    ]
                },
                posts: 1
            }
        }, {
            $sort: {
                'timestamp': -1
            }
        }])
        res.render('feed', {
            user: req.user,
            feed
        })
    } catch (e) {
        console.error(e)
    }
})

module.exports = router