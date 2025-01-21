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

app.get('/', function(req, res){
	res.render('index.ejs')
})

app.delete('/cars/:carId', async function(req, res){

	const deletedCar = await CarModel.findByIdAndDelete(req.params.carId)

	res.redirect('/cars')
})


app.get('/cars', async function(req, res){
	// get all of the fruits from the db!

	const allCarDocs = await CarModel.find({})
	console.log(allCarDocs)

	res.render('cars/index.ejs', {carDocs: allCarDocs})
})


app.get('/cars/new', function(req, res){

	// render always looks in the views folder
	// for the our ejs filesres.render('fruits/new.ejs')!
	res.render('cars/new.ejs')
})

// the new route must be defined before the show, because params are catch alls
app.get('/cars/:carId', async function(req, res){
	console.log(req.params.carId, " <- req.params.carId")

	// using the id from the request, 
	// tell the model to go find that specific fruit from the database!
	const carDoc = await CarModel.findById(req.params.carId)
	console.log(carDoc)

	res.render('cars/show.ejs', {carDoc: carDoc})
})

app.post('/cars', async function(req, res){

	// to access the contents of the form
	console.log(req.body, " <- body of our request")
	if(req.body.isReadyToDive === 'on'){
		req.body.isReadyToDrive = true
	} else {
		req.body.isReadyToDrive = false
	}

	// one line of if/else
	// req.body.isReadyToEat = !!req.body.isReadyToEat


	// req.body is the contents of the form that we want to put in the 
	// db
	const carDoc = await CarModel.create(req.body)
	console.log(carDoc)
	res.redirect('/cars') // tell the client to make a get
	// request to /fruits 
})


app.listen(3000, function(){
	console.log('Listening on Port 3000')
})