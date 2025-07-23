const Listing = require("../models/listing");
const { listingSchema, reviewSchema } = require("../schema.js");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings})
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new")
};

module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({ 
        path: "reviews",
        populate: {
        path: "author",
    },
})
    .populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    console.log(listing);
     return res.render("listings/show.ejs", {listing})
};

module.exports.createListing = async (req, res, next) => {
    const listing = new Listing(req.body.listing);
    if (req.file) {
        listing.image = { url: req.file.path, filename: req.file.filename };
    }
    if (req.user) {
        listing.owner = req.user._id;
    } else {
        req.flash("error", "You must be logged in to create a listing.");
        return res.redirect("/login");
    }
    await listing.save();
    req.flash("success", "Listing created successfully");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.renderEditForm = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
     if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload/w_250"); // Normalize the URL for consistency
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    if (req.file) {
        listing.image = { url: req.file.path, filename: req.file.filename };
    }
    await listing.save();
    Object.assign(listing, req.body.listing);
    if (req.file) {
        listing.image = { url: req.file.path, filename: req.file.filename };
    }
    await listing.save();
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${listing._id}`)
};


module.exports.destroyListing = async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings")
};

// Using MVC Framework!