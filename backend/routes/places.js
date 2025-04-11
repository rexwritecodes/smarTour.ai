const express = require("express");
const axios = require("axios");
const { getPexelsImages } = require("../utils/pexels");

const router = express.Router();

// ✅ Allowed & Excluded Categories
const allowedCategories = [
    "monument", "museum", "historical", "fort", "temple", "church",
    "beach", "park", "landmark", "tourist", "nature", "heritage", "art", "garden"
];

const excludedCategories = [
    "college", "university", "school", "hospital", "company", "institute",
    "stock exchange", "metro station", "village", "police", "bank", "government"
];

// ✅ GET Route: Fetch and filter tourist attractions
router.get("/", async (req, res) => {
    try {
        const city = req.query.city || "Pune";
        const WIKI_API_URL = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageterms|pageimages&generator=search&gsrsearch=tourist+attractions+in+${city}&piprop=original`;

        // ✅ Fetch places from Wikipedia
        const wikiResponse = await axios.get(WIKI_API_URL);
        if (!wikiResponse.data.query || !wikiResponse.data.query.pages) {
            throw new Error(`No data found for ${city}`);
        }

        // ✅ Filter & map results
        let places = Object.values(wikiResponse.data.query.pages)
            .filter(page => {
                const desc = page.terms?.description?.[0]?.toLowerCase() || "";
                const isTouristSpot = allowedCategories.some(keyword => desc.includes(keyword));
                const isExcluded = excludedCategories.some(keyword => desc.includes(keyword));
                return isTouristSpot && !isExcluded;
            })
            .map(page => ({
                name: page.title,
                description: page.terms?.description?.[0] || "No description available",
                image: page.original?.source || null, // ✅ Try using higher-quality image
                url: `https://en.wikipedia.org/?curid=${page.pageid}`
            }));

        // ✅ Fetch images from Pexels if Wikipedia has no images
        for (let place of places) {
            if (!place.image) {
                const pexelsImages = await getPexelsImages(`${place.name} ${city}`, 1);
                if (pexelsImages.length > 0) {
                    place.image = page.thumbnail?.source.replace(/(\d+)px/, "1024px");
                }
            }
        }

        res.json({ city, places });

    } catch (error) {
        console.error("❌ Error fetching places:", error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
