// models/cars.js

const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
    name: String,
    isReadyToDrive: Boolean,
  });

  // initialize the model which creates the collection in mongodb (aka the bucketid)
// and returns the object we can use to perform CRUD on the collection in the db
const Car = mongoose.model('Car', carSchema)

// export the object to use in other files!
module.exports = Car