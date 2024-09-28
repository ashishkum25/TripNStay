const mongoose = require("mongoose");
mongoose.connect(``);
const Review = require("./review.js");
const listingSchema = mongoose.Schema({
  title: "string",
  description: "string",
  image: "string",
  price: "number",
  location: "string",
  country: "string",
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review"
    },
  ],
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if(listing) {
    await Review.deleteMany({_id : {$in: listing.reviews}});
  }
});

module.exports = mongoose.model("Listing",listingSchema);
