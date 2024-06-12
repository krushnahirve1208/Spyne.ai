const express = require("express");
const router = express.Router();
const { registerUser, loginUser,protectRoute } = require("../controllers/auth.controller");
const {
  getUserProfile,
  deleteUser,
  updateUserProfile,
} = require("../controllers/user.controller");

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/:name", getUserProfile);
router.patch("/:userId",protectRoute, updateUserProfile);
router.delete("/:userId",protectRoute, deleteUser);

module.exports = router;
