const express = require("express");
const axios = require("axios");
const router = express.Router();

// ✅ Function to fetch tourist places from OpenTripMap API
async function getTouristPlaces(lat, lon) {
    const apiKey = process.env.OPENTRIPMAP_API_KEY;
    const radius = 10000;
    const url = `https://api.opentripmap.com/0.1/en/places/radius?radius=${radius}&lon=${lon}&lat=${lat}&kinds=historic,cultural,natural,architecture&format=json&apikey=${apiKey}`;

    try {
        const response = await axios.get(url);
        return response.data.map(place => ({
            name: place.name || "Unknown Place",
            description: place.kinds.replace(/_/g, " "),
            image: `https://source.unsplash.com/400x300/?${place.name.replace(" ", "+")}`, // ✅ Unsplash as fallback
            url: `https://opentripmap.com/en/card/${place.xid}`
        }));
    } catch (error) {
        console.error("Error fetching tourist places:", error.message);
        return [];
    }
}

// ✅ GET Route: Fetch tourist places based on latitude & longitude
router.get("/", async (req, res) => {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
        return res.status(400).json({ error: "Latitude and Longitude are required" });
    }

    try {
        const places = await getTouristPlaces(lat, lon);
        res.json({ places });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
