const app = require("./app");
const connectDB = require("./config/db.config");
require("dotenv").config();

// Connect to the database
connectDB();

// Start the server
const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => {
  res.send("API is running...");
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
