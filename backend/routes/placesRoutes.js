const express = require("express");
const router = express.Router();

// Import controllers or direct route handlers
const touristController = require("./tourist");
const placesController = require("./places");

// Define routes directly here
router.use("/tourist", touristController);
router.use("/", placesController);  // Changed from "/places" to "/" to avoid route nesting

module.exports = router;