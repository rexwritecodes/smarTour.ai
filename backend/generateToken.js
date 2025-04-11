// generateToken.js
const jwt = require("jsonwebtoken");

const token = jwt.sign(
  { userId: "12345", name: "Test User" },
  "6f0c77bbccf610a3243debfeab72bb5a7e741a6a7bb019733339d617759827c315eadd04165efe64c73ecb67c7d1bfe8f85dcd3c38bbc362bb04159511bcf1a5", // Replace this with your real JWT_SECRET
  { expiresIn: "1h" }
);

console.log("Your test token:", token);
