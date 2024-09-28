const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");  // Removed unused listingSchema
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

// ServerSide Review Validation Middleware
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(", ");
        return next(new ExpressError(400, errMsg));  // Forward error to global error handler
    }
    next();
};

// Post Review Route
router.post("/", validateReview, wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }

    const newReview = new Review(req.body.review);
    listing.reviews.push(newReview);  // Push the review into the listing's reviews array
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created!!");
    res.redirect(`/listings/${listing._id}`);
}));

// Delete Review Route
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    
    // Pull the review from the listing's reviews array and delete the review itself
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!!");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;
