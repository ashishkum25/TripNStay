const mongoose = require("mongoose");
<<<<<<< HEAD
=======
mongoose.connect(``);
>>>>>>> ac132d166f6ec38fcc5bc54428d7fc7c1d114edb
const Review = require("./review.js");

const listingSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
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
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: [true, 'Geometry type is required'],
      default: 'Point'  // Set default to 'Point'
    },
    coordinates: {
      type: [Number],
      required: [true, 'Coordinates are required'],
      validate: {
        validator: function (arr) {
          return arr.length === 2;
        },
        message: 'Coordinates must contain exactly two elements [longitude, latitude]'
      }
    }
  }
});

// Cascade delete for reviews
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

module.exports = mongoose.model("Listing", listingSchema);
