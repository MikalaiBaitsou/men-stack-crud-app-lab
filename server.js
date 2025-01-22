// load our environment variables
const dotenv = require('dotenv')
dotenv.config()// load the variables from .env file!

const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const methodOverride = require('method-override')
//initailize the express app
const app = express()


// import the model to talk to the db
const CarModel = require('./models/car')

const carCtrl = require('./controllers/cars')

// Connect our express server to the database!
mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on('connected', function(){
	console.log('Express has establised a connection with MongoDB')
})

// middleware to process the form requests
// so our routes can access req.body which is the contents of the form
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev")); //new
app.use(methodOverride("_method")); // 

app.use('/cars', carCtrl)

app.get('/', function(req, res){
	res.render('index.ejs')
})



app.listen(3000, function(){
	console.log('Listening on Port 3000')
})