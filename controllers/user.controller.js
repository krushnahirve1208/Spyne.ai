const User = require("../models/user.model");
const asyncHandler = require("express-async-handler");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
};

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

const updateUserProfile = asyncHandler(async (req, res, next) => {
  const userId = req.params.userId;
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, "username", "email", "mobileNo");

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(userId, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

const getUserById = asyncHandler(async (req, res) => {
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
});

const deleteUser = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.params.userId);
  res
    .status(204)
    .json({ status: "success", message: "User deleted successfully" });
});

const followUser = asyncHandler(async (req, res) => {
  const userToFollow = await User.findById(req.params.userId);
  const currentUser = await User.findById(req.user._id);

  // Ensure the target user exists
  if (!userToFollow) {
    return res.status(404).json({ status: "fail", message: "User not found" });
  }

  // Check if the user is trying to follow themselves
  if (req.params.userId === req.user._id) {
    return res
      .status(400)
      .json({ status: "fail", message: "You cannot follow yourself" });
  }

  // Check if the current user is already following the target user
  if (currentUser.following.includes(userToFollow._id)) {
    return res
      .status(400)
      .json({ status: "fail", message: "You are already following this user" });
  }

  // Update the following array of the current user and the followers array of the target user
  currentUser.following.push(userToFollow._id);
  userToFollow.followers.push(currentUser._id);

  // Save the updated documents
  await Promise.all([currentUser.save(), userToFollow.save()]);

  res
    .status(200)
    .json({ status: "status", message: "User followed successfully" });
});

const unfollowUser = asyncHandler(async (req, res) => {
  const userToUnfollow = await User.findById(req.params.userId);
  const currentUser = await User.findById(req.user._id);

  // Ensure the target user exists
  if (!userToUnfollow) {
    return res.status(404).json({ status: "fail", message: "User not found" });
  }

  // Check if the current user is not following the target user
  if (!currentUser.following.includes(userToUnfollow._id)) {
    return res
      .status(400)
      .json({ status: "fail", message: "You are not following this user" });
  }

  // Remove the target user from the following array of the current user
  currentUser.following.pull(userToUnfollow._id);

  // Remove the current user from the followers array of the target user
  userToUnfollow.followers.pull(currentUser._id);

  // Save the updated documents
  await Promise.all([currentUser.save(), userToUnfollow.save()]);

  res
    .status(200)
    .json({ status: "success", message: "User unfollowed successfully" });
});

module.exports = {
  deleteUser,
  updateUserProfile,
  getUsers,
  unfollowUser,
  followUser,
  getUserById,
};
