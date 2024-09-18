const mongoose = require("mongoose");
mongoose.connect(`mongodb+srv://webashish44:Wildcraft17@cluster0.nqcyyfe.mongodb.net/TripNStay`);

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
