const User = require("../models/user.model");
const asyncHandler = require("express-async-handler");
const APIFeatures = require("../utils/apiFeatures");

const getUsers = asyncHandler(async (req, res) => {
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const users = await features.query;
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

const updateUserProfile = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.params.userId, req.body);
  res.status(200).json({ message: "User updated successfully" });
});

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

const deleteUser = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.params.userId);
  res.status(200).json({ message: "User deleted successfully" });
});

const followUser = asyncHandler(async (req, res) => {
  const userToFollow = await User.findById(req.params.id);
  const currentUser = await User.findById(req.user.id);

  if (req.params.id === req.user.id) {
    return res.status(400).json({ message: "You cannot follow yourself" });
  }

  if (!userToFollow) {
    return res.status(404).json({ message: "User not found" });
  }

  if (currentUser.following.includes(userToFollow._id)) {
    return res
      .status(400)
      .json({ message: "You are already following this user" });
  }

  currentUser.following.push(userToFollow._id);
  userToFollow.followers.push(currentUser._id);

  // Update the documents without running validators
  await User.updateOne({ _id: currentUser._id }, currentUser);
  await User.updateOne({ _id: userToFollow._id }, userToFollow);

  res.status(200).json({ message: "User followed successfully" });
});

const unfollowUser = asyncHandler(async (req, res) => {
  const userToUnfollow = await User.findById(req.params.id);
  const currentUser = await User.findById(req.user.id);

  if (!userToUnfollow) {
    return res.status(404).json({ message: "User not found" });
  }

  if (!currentUser.following.includes(userToUnfollow._id)) {
    return res.status(400).json({ message: "You are not following this user" });
  }

  currentUser.following.pull(userToUnfollow._id);
  userToUnfollow.followers.pull(currentUser._id);

  // Update the documents without running validators
  await User.updateOne({ _id: currentUser._id }, currentUser);
  await User.updateOne({ _id: userToUnfollow._id }, userToUnfollow);

  res.status(200).json({ message: "User unfollowed successfully" });
});

module.exports = {
  deleteUser,
  updateUserProfile,
  getUsers,
  unfollowUser,
  followUser,
  getUserById,
};
