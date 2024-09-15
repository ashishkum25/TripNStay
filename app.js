const express = require("express");
const app = express();
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Index route
app.get("/", (req, res) => {
    res.send("Hi Ashish");
});
//New Route
app.get("/listings/new", (req, res) => {
    res.render("new.ejs");
});
// Listings route
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("index.ejs", { allListings });
});
//Create Route
app.post("/listings", async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});
//Show Route
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("show.ejs", { listing });
});
//Edit Route
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("edit.ejs", { listing });
});
//Update Route
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
});
//Delete Route
app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});
