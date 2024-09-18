const mongoose = require("mongoose");
mongoose.connect(``);

const listingSchema = mongoose.Schema({
  title: "string",
  description: "string",
  image: {
    filename:"string",
    url: "string",
  },
  price: "number",
  location: "string",
  country: "string",
});
module.exports = mongoose.model("Listing",listingSchema);
