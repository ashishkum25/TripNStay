const mongoose = require("mongoose");
const initData = require("./data.js"); // Correctly import the sample listings array
const Listing = require("../models/listing.js");

<<<<<<< HEAD

=======
mongoose.connect(``);
>>>>>>> ac132d166f6ec38fcc5bc54428d7fc7c1d114edb
const initDB = async () => {
  await Listing.deleteMany({});
  const updatedData = initData.map((obj) => ({ ...obj, owner: "66f854a319b796f7bf7b163e" })); // No .data here
  await Listing.insertMany(updatedData);
  console.log("Data was initialized");
};

// Do not call initDB directly; it's called after a successful connection

