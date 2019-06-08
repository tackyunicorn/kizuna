const express = require('express')

const app = express()
const port = process.env.PORT || 3000

// create home route
app.get('/', (req, res) => {
    res.send('Welcome to kizuna!')
})

// start the server
app.listen(port, () => {
    console.log('Server is up on port: ' + port)
})