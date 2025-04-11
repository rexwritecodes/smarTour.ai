const express = require("express");
const router = express.Router();

// Import controllers or direct route handlers instead of sub-routes
const touristController = require("./tourist");
const placesController = require("./places");

// Define routes directly here
router.use("/tourist", touristController);
router.use("/places", placesController);

module.exports = router;
