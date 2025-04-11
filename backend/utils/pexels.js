const axios = require("axios");

const PEXELS_API_KEY = "JFYYxRyh7yIUj0vQG9nDjtWjK1Mo88IGj4vmRtT1TzqmwgGS8PbRF0bz"; // 🔹 Replace with your API key
const PEXELS_BASE_URL = "https://api.pexels.com/v1/search";

/**
 * Fetch images from Pexels based on the given query (e.g., "Pune tourist places").
 */
async function getPexelsImages(query, perPage = 5) {
    try {
        const response = await axios.get(PEXELS_BASE_URL, {
            headers: { Authorization: PEXELS_API_KEY },
            params: { query, per_page: perPage }
        });

        return response.data.photos.map(photo => ({
            id: photo.id,
            url: photo.src.medium,  // ✅ Medium size image
            photographer: photo.photographer
        }));
    } catch (error) {
        console.error("❌ Error fetching images from Pexels:", error.message);
        return [];
    }
}

module.exports = { getPexelsImages };
