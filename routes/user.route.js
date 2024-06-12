const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  protectRoute,
  logoutUser,
} = require("../controllers/auth.controller");
const {
  getUserById,
  deleteUser,
  updateUserProfile,
  unfollowUser,
  followUser,
  getUsers,
} = require("../controllers/user.controller");

router.get("/", getUsers);

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", protectRoute, logoutUser);

router
  .route("/:userId")
  .patch(protectRoute, updateUserProfile)
  .delete(protectRoute, deleteUser)
  .get(getUserById);

router.route("/follow/:id").post(protectRoute, followUser);

router.route("/unfollow/:id").post(protectRoute, unfollowUser);

module.exports = router;
