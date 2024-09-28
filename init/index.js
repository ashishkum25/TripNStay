const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

mongoose.connect(``);
const initDB = async () => {
  await Listing.deleteMany({});
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();
