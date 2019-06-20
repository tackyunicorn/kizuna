const router = require('express').Router()

const User = require('../models/user')

const authCheck = (req, res, next) => {
    if (!req.user) {
        // if user is not logged in
        res.redirect('/auth/login')
    } else {
        // if logged in
        next()
    }
}

router.post('/', authCheck, async (req, res) => {
    try {
        const dbResponse = await User.find({
            $text: {
                $search: req.body.searchTerm
            }
        }, {
            score: {
                $meta: "textScore"
            }
        }).sort({
            score: {
                $meta: 'textScore'
            }
        }).limit(7)
        const results = dbResponse.filter((user) => user.id !== req.user.id)
        res.send({ results })
    } catch (e) {
        console.error(e)
    }
})

module.exports = router