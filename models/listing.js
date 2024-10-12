const mongoose = require("mongoose");
mongoose.connect(`mongodb+srv://webashish44:Wildcraft17@cluster0.nqcyyfe.mongodb.net/TripNStay`);
const Review = require("./review.js");
const listingSchema = mongoose.Schema({
  title: "string",
  description: "string",
  image: {
    url: String,
    filename: String,
  },
  price: "number",
  location: "string",
  country: "string",
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review"
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if(listing) {
    await Review.deleteMany({_id : {$in: listing.reviews}});
  }
});

module.exports = mongoose.model("Listing",listingSchema);
