const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  protectRoute,
} = require("../controllers/auth.controller");
const {
  getUserProfile,
  deleteUser,
  updateUserProfile,
} = require("../controllers/user.controller");

router.get("/", getUserProfile);

router.post("/register", registerUser);
router.post("/login", loginUser);

router
  .route("/:userId")
  .patch(protectRoute, updateUserProfile)
  .delete(protectRoute, deleteUser);

module.exports = router;
