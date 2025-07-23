const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(0),
    location: Joi.string().required(),
    country: Joi.string().required(),
    category: Joi.string()
      .valid("Apartment", "House", "Villa", "Cottage", "Cabin", "Farmhouse")
      .required(),
    amenities: Joi.array().items(Joi.string()),  // optional if you added amenities
    bedrooms: Joi.number().required().min(0),
    beds: Joi.number().required().min(0),
    bathrooms: Joi.number().required().min(0),
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating:
  Joi.number().required().min(1).max(5),
  Comment: Joi.string().required()
  }).required()
});

