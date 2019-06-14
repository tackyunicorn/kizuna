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

router.get('/:id', authCheck, async (req, res) => {
    try {
        const foundUser = await User.find({ _id: req.params.id })
        res.render('profile', {
            user: req.user,
            foundUser: foundUser[0],
            self: false
        })
    } catch (e) {
        console.error(e)
    }
})

module.exports = router