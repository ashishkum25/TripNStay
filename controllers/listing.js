const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;

// Check if MAP_TOKEN is available
if (!mapToken) {
  console.error('Error: MAP_TOKEN is not defined in .env file');
  process.exit(1); // Exit the process if MAP_TOKEN is not defined
}

console.log("Mapbox Token:", mapToken); // For debugging

const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// Index Controller
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

// Render New Form
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// Show Listing
module.exports.showListing = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");

    if (!listing) {
      req.flash("error", "Listing you requested does not exist!");
      return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
  } catch (err) {
    console.error(err);
    req.flash("error", "An error occurred while fetching the listing.");
    res.redirect("/listings");
  }
};

// Create Listing
module.exports.createListing = async (req, res, next) => {
  try {
    const response = await geocodingClient.forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    }).send();

    console.log("Geocoding API response:", JSON.stringify(response.body, null, 2));

    let geometry = {
      type: 'Point',
      coordinates: [0, 0]
    };

    if (response.body.features.length) {
      const geoData = response.body.features[0].geometry;
      geometry = {
        type: geoData.type || 'Point',
        coordinates: geoData.coordinates || [0, 0]
      };
    }

    console.log("Final geometry:", geometry);

    const url = req.file?.path || "";
    const filename = req.file?.filename || "";

    const newListing = new Listing({
      ...req.body.listing,
      owner: req.user._id,
      image: { url, filename },
      geometry: {
        type: geometry.type,
        coordinates: geometry.coordinates,
      }
    });

    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  } catch (err) {
    console.error("Error creating listing:", err);
    next(err);
  }
};

// Render Edit Form
module.exports.renderEditForm = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      req.flash("error", "Listing you requested does not exist!");
      return res.redirect("/listings");
    }

    const originalImageUrl = listing.image?.url.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
  } catch (err) {
    console.error(err);
    req.flash("error", "An error occurred while fetching the edit form.");
    res.redirect("/listings");
  }
};

// Update Listing
module.exports.updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (req.file) {
      listing.image = { url: req.file.path, filename: req.file.filename };
    }

    await listing.save();
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.error(err);
    req.flash("error", "An error occurred while updating the listing.");
    res.redirect("/listings");
  }
};

// Delete Listing
module.exports.deleteListing = async (req, res) => {
  try {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
  } catch (err) {
    console.error(err);
    req.flash("error", "An error occurred while deleting the listing.");
    res.redirect("/listings");
  }
};
