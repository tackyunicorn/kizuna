const router = require('express').Router()
const uuidv1 = require('uuid/v1')

const s3Bucket = require('../db/aws')
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

router.post('/', authCheck, (req, res) => {
    buf = new Buffer.from(req.body.image.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    var imageUploadObject = {
        Key: uuidv1() + '.png',
        Body: buf,
        ContentEncoding: 'base64',
        ContentType: 'image/*'
    };
    s3Bucket.upload(imageUploadObject, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            Post({
                userid: req.user.id,
                location: data.Location,
                caption: req.body.caption,
                private: req.body.private
            }).save().then((newPost) => {
                console.log('new post created: ' + newPost)
                res.json({
                    success: "post created",
                    status: 201
                });
            })
        }
    });
})

module.exports = router