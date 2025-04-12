// routes/aiTrip.js
const express = require("express");
const router = express.Router();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
router.post("/trip", async (req, res) => {
  const { destination, days, budget, type } = req.body;

  if (!destination || !days || !budget || !type) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const prompt = `Act as a travel planning assistant. Suggest a ${days}-day itinerary for a ${type} traveler visiting ${destination} for the first time. Focus on cultural experiences, local food, and must-see landmarks. Budget is ${budget} INR. Provide transportation options and estimated costs. Format the output as a day-by-day schedule. also list what prerequisites are needed for the trip. Include a list of must-see places and their distances from the hotel. Use markdown for formatting.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        }),
      }
    );

    const data = await response.json();
    const aiMessage = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (aiMessage) {
      res.json({ aiMessage });
    } else {
      res.status(500).json({ error: "No valid response from Gemini." });
    }
  } catch (error) {
    console.error("Error in AI Trip Route:", error);
    res.status(500).json({ error: "AI error: " + error.message });
  }
});

module.exports = router;
