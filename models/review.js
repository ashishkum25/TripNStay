const mongoose = require("mongoose");

// Review schema definition
const reviewSchema = new mongoose.Schema({
    comment: String, // Use String without quotes
    description: String, // Use String without quotes
    rating: {
        type: Number, // Use Number without quotes
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now // Remove parentheses to set the default to the current date/time when a review is created
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
});

// Export the Review model
module.exports = mongoose.model("Review", reviewSchema);
