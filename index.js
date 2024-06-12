const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db.config");
require("dotenv").config();

const app = express();

connectDB();

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());

// Routes
const userRoutes = require("./routes/user.route");
const postRoutes = require("./routes/post.route");
app.use("/api/v1/users", userRoutes);
app.use("api/v1/posts", postRoutes);

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
