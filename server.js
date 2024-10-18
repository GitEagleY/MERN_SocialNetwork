const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const authMiddleware = require("./middleware/authMiddleware");
require("dotenv").config();

app.use(cors()); // Allow all origins by default
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/mySocialNetwork", {
    //useNewUrlParser: true,
    //useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const userRoutes = require("./routes/users");
const postRoutes = require("./routes/posts");

app.use("/api/users", userRoutes);
app.use("/api/posts", authMiddleware, postRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
