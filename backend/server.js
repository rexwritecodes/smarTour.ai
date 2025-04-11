require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Import route handlers
const touristRoutes = require("./routes/tourist");
const placesRoutes = require("./routes/placesRoutes");

const app = express();



// ✅ Middleware
app.use(cors({
    origin: "*", // Allow all origins (for testing)
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// ✅ Routes
app.use("/api/tourist", touristRoutes);
app.use("/api", placesRoutes);

// ✅ Root Route
app.get("/", (req, res) => {
    res.send("🌍 AI Travel Companion Backend is running...");
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;

app.post("/api/chatbot/ask", async (req, res) => {
    const { userMessage } = req.body;

    if (!userMessage) {
        return res.status(400).json({ error: "User message is required" });
    }

    try {
        console.log("Sending request to Gemini AI...");

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`
,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: userMessage }] }]
                }),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error("API Error:", errorData);
            return res.status(response.status).json({ 
                error: errorData.error?.message || "API request failed" 
            });
        }

        const data = await response.json();
        console.log("AI Response:", data);

        if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
            res.json({ aiMessage: data.candidates[0].content.parts[0].text });
        } else if (data.promptFeedback?.blockReason) {
            res.status(400).json({ error: `Content blocked: ${data.promptFeedback.blockReason}` });
        } else {
            res.status(500).json({ error: "Unexpected response format from AI" });
        }
    } catch (error) {
        console.error("Error fetching AI response:", error);
        res.status(500).json({ error: "Error communicating with AI: " + error.message });
    }
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
