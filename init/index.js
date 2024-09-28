const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

mongoose.connect(`mongodb+srv://webashish44:Wildcraft17@cluster0.nqcyyfe.mongodb.net/TripNStay`);
const initDB = async () => {
  await Listing.deleteMany({});
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();
