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
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
  });
  module.exports = mongoose.model("Review",reviewSchema);
