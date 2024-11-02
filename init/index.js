const mongoose = require("mongoose");
const initData = require("./data.js"); // Correctly import the sample listings array
const Listing = require("../models/listing.js");


const initDB = async () => {
  await Listing.deleteMany({});
  const updatedData = initData.map((obj) => ({ ...obj, owner: "66f854a319b796f7bf7b163e" })); // No .data here
  await Listing.insertMany(updatedData);
  console.log("Data was initialized");
};

// Do not call initDB directly; it's called after a successful connection

