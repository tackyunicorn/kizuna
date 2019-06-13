require('dotenv').config()

const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false
}, () => {
	console.log('connected to mongodb')
})