const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  protectRoute,
  logoutUser,
} = require("../controllers/auth.controller");
const {
  getUserProfile,
  deleteUser,
  updateUserProfile,
  unfollowUser,
  followUser,
} = require("../controllers/user.controller");

router.get("/", getUserProfile);

router.post("/register", registerUser);
router.post("/login", loginUser);

router
  .route("/:userId")
  .patch(protectRoute, updateUserProfile)
  .delete(protectRoute, deleteUser);

router.route("/follow/:id").post(protectRoute, followUser);

router.route("/unfollow/:id").post(protectRoute, unfollowUser);

router.post("/logout", protectRoute, logoutUser);
module.exports = router;
