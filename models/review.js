const mongoose = require("mongoose");
mongoose.connect(``);

const reviewSchema = mongoose.Schema({
    comment: "string",
    description: "string",
    rating: {
        type: "Number",
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
  });
  module.exports = mongoose.model("Review",reviewSchema);
