const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

mongoose.connect(`mongodb+srv://webashish44:Wildcraft17@cluster0.nqcyyfe.mongodb.net/TripNStay`);
const initDB = async () => {
  await Listing.deleteMany({});
  const updatedData = initData.data.map((obj) => ({ ...obj, owner: "66f854a319b796f7bf7b163e" }));
  await Listing.insertMany(updatedData);
  console.log("data was initialized");
};

initDB();
