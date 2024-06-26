const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  protectRoute,
  logoutUser,
  forgotPassword,
  resetPassword,
  updatePassword,
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
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);
router.patch("/updateMyPassword", protectRoute, updatePassword);

router
  .route("/:userId")
  .patch(protectRoute, updateUserProfile)
  .delete(protectRoute, deleteUser)
  .get(getUserById);
router.route("/:userId/follow").post(protectRoute, followUser);
router.route("/:userId/unfollow/").post(protectRoute, unfollowUser);

module.exports = router;
