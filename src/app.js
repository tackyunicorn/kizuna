const express = require('express')
const path = require('path')

const app = express()
const port = process.env.PORT || 3000

const viewsPath = path.join(__dirname, '../templates/views')
const publicDirectoryPath = path.join(__dirname, '../public')

// set up view engine
app.set('view engine', 'ejs')
app.set('views', viewsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

// create home route
app.get('/', (req, res) => {
    res.render('feed')
})

// create terms-conditions route
app.get('/terms-conditions', (req, res) => {
    res.render('terms-conditions')
})

// create privacy-policy route
app.get('/privacy-policy', (req, res) => {
    res.render('privacy-policy')
})

// start the server
app.listen(port, () => {
    console.log('Server is up on port: ' + port)
})