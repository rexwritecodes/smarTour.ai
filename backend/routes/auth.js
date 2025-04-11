const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username === "admin" && password === "admin") {
        const token = jwt.sign(
            { userId: "12345", name: "Test User" },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        return res.json({ success: true, token });
    } else {
        return res.status(401).json({ error: "Invalid credentials" });
    }
});

module.exports = router;
