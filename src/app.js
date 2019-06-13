require('./db/mongoose')

const express = require('express')
const path = require('path')
const passport = require('passport')
const cookieSession = require('cookie-session')

const authRoutes = require('./routes/auth')
const profileRoutes = require('./routes/profile')

const app = express()
const port = process.env.PORT || 3000

const viewsPath = path.join(__dirname, '../templates/views')
const publicDirectoryPath = path.join(__dirname, '../public')

// set up view engine
app.set('view engine', 'ejs')
app.set('views', viewsPath)

// set up static directory to serve
app.use(express.static(publicDirectoryPath))

// cookie session setup of 24hrs
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY]
}))

// initialize passport
app.use(passport.initialize())
app.use(passport.session())

// set up routes
app.use('/auth', authRoutes)
app.use('/profile', profileRoutes)

// create home route
app.get('/', (req, res) => {
    if (!req.user) {
        res.redirect('/auth/login')
    } else {
        res.redirect('/profile/feed')
    }
})

// create terms-conditions route
app.get('/terms-conditions', (req, res) => {
    res.render('terms-conditions', { user: req.user })
})

// create privacy-policy route
app.get('/privacy-policy', (req, res) => {
    res.render('privacy-policy', { user: req.user })
})

// start the server
app.listen(port, () => {
    console.log('server is up on port: ' + port)
})