const express = require("express");
const router = express.Router();
const CarModel = require("../models/car");

router.delete("/:carId", async function (req, res) {
  const deletedCar = await CarModel.findByIdAndDelete(req.params.carId);

  res.redirect("/");
});

router.get("/:carId/edit", async function (req, res) {
  const foundCar = await CarModel.findById(req.params.carId);
  console.log(foundCar);
  res.render("cars/edit.ejs", { carDoc: foundCar });
});

router.put("/:carId", async function (req, res) {
  // make sure that our checkbox is changed to a boolean
  console.log(req.body);
  req.body.isReadyToDrive = !!req.body.isReadyToDrive;
  const foundCar = await CarModel.findByIdAndUpdate(
    req.params.carId,
    req.body,
    { new: true }
  );
  console.log(foundCar);
  res.redirect(`/cars/${foundCar._id}`);
});

router.get("/", async function (req, res) {
  // get all of the  from the db!

  try {
	const allCarDocs = await CarModel.find({});
	// console.log(allFruitDocs)
  
	res.render("cars/index.ejs", { carDocs: allCarDocs });
  } catch(err){
	console.log(err)
	res.send('error rendering all the cars')
  }
 
});

router.get("/new", function (req, res) {
  // render always looks in the views folder
  // for the our ejs filesres.render('/new.ejs')!
  res.render("cars/new.ejs");
});

// the new route must be defined before the show, because params are catch alls
router.get("/:carId", async function (req, res) {
  console.log(req.params.carId, " <- req.params.fruitId");

  // using the id from the request,
  // tell the model to go find that specific fruit from the database!

  try {
	const carDoc = await CarModel.findById(req.params.carId);
	console.log(carDoc);
  
	res.render("cars/show.ejs", { carDoc: carDoc });

  } catch(err){
	res.send(err.message)
  }

});

router.post("/", async function (req, res) {
  // to access the contents of the form
  console.log(req.body, " <- body of our request");
  if (req.body.isReadyToDrive === "on") {
    req.body.isReadyToDrive = true;
  } else {
    req.body.isReadyToDrive = false;
  }

  // one line of if/else
  // req.body.isReadyToEat = !!req.body.isReadyToEat

  // req.body is the contents of the form that we want to put in the
  // db

  try {
    const carDoc = await CarModel.create(req.body);
    console.log(carDoc);
    res.redirect("/"); // tell the client to make a get
    // request to /
  } catch (err) {
    console.log(err.message);
    // res.send("error creating fruit");
	res.render('cars/new.ejs', { errorMessage: err.message})
  }
});

module.exports = router;
