require("dotenv").config();

const express = require("express");
const cors = require("cors");

// 🛠 Import routes and DB connection
const touristRoutes = require("./routes/tourist");
const placesRoutes = require("./routes/placesRoutes");
const protectedRoutes = require("./routes/protected");
const authRoutes = require("./routes/authRoutes"); // ✅ Only one declaration
const connectDB = require("./db");

const app = express();

// ✅ Middleware
app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

// ✅ Routes
app.use("/api", protectedRoutes); // /api/profile etc.
app.use("/api/auth", authRoutes); // /api/auth/login etc.
app.use("/api/tourist", touristRoutes);
app.use("/api", placesRoutes);

// ✅ Dummy Login Route for Testing (optional, remove if using real one)
const dummyUser = {
    username: "admin",
    password: "1234"
};

app.post("/api/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: "Username and password are required" });
    }

    if (username === dummyUser.username && password === dummyUser.password) {
        return res.json({ success: true, message: "Login successful" });
    } else {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
});

// ✅ Gemini AI Chatbot Route
app.post("/api/chatbot/ask", async (req, res) => {
    const { userMessage } = req.body;

    if (!userMessage) {
        return res.status(400).json({ error: "User message is required" });
    }

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: userMessage }] }]
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ error: data.error?.message || "API request failed" });
        }

        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        const blockReason = data.promptFeedback?.blockReason;

        if (aiText) {
            res.json({ aiMessage: aiText });
        } else if (blockReason) {
            res.status(400).json({ error: `Content blocked: ${blockReason}` });
        } else {
            res.status(500).json({ error: "Unexpected response format from AI" });
        }
    } catch (error) {
        console.error("Error fetching AI response:", error);
        res.status(500).json({ error: "Error communicating with AI: " + error.message });
    }
});

// ✅ Root Health Check
app.get("/", (req, res) => {
    res.send("🌍 AI Travel Companion Backend is running...");
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;

// ✅ Connect to MongoDB Atlas
connectDB();

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
