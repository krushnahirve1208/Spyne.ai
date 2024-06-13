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

const getUsers = asyncHandler(async (req, res, next) => {
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

const getUserById = asyncHandler(async (req, res, next) => {
  const userId = req.params.userId;

  const user = await User.findById(userId);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
  next();
});

const updateUserProfile = asyncHandler(async (req, res, next) => {
  const userId = req.params.userId;

  // Ensure the user trying to update the profile is the same as the user being updated
  if (req.user._id.toString() !== userId) {
    return next(
      new AppError("You do not have permission to update this profile", 403)
    );
  }

  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }

  const filteredBody = filterObj(req.body, "username", "email", "mobileNo");
  const updatedUser = await User.findByIdAndUpdate(userId, filteredBody, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

const deleteUser = asyncHandler(async (req, res, next) => {
  if (req.user._id.toString() !== req.params.userId) {
    return next(
      new AppError("You do not have permission to delete this account", 403)
    );
  }

  const user = await User.findByIdAndDelete(req.params.userId);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(204).json({
    status: "success",
    message: "User deleted successfully",
  });
});

const followUser = asyncHandler(async (req, res, next) => {
  const userIdToFollow = req.params.userId;
  const currentUserId = req.user._id;

  const userToFollow = await User.findById(userIdToFollow);
  if (!userToFollow) {
    return next(new AppError("User not found", 404));
  }

  if (userIdToFollow === String(currentUserId)) {
    return next(new AppError("You cannot follow yourself", 400));
  }

  const currentUser = await User.findById(currentUserId);
  if (currentUser.following.includes(userIdToFollow)) {
    return next(new AppError("You are already following this user", 400));
  }

  await User.findByIdAndUpdate(currentUserId, {
    $addToSet: { following: userIdToFollow },
  });
  await User.findByIdAndUpdate(userIdToFollow, {
    $addToSet: { followers: currentUserId },
  });

  res.status(200).json({
    status: "success",
    message: "User followed successfully",
  });
});

const unfollowUser = asyncHandler(async (req, res, next) => {
  const userIdToUnfollow = req.params.userId;
  const currentUserId = req.user._id;

  const userToUnfollow = await User.findById(userIdToUnfollow);
  if (!userToUnfollow) {
    return next(new AppError("User not found", 404));
  }

  const currentUser = await User.findById(currentUserId);
  if (!currentUser.following.includes(userIdToUnfollow)) {
    return next(new AppError("You are not following this user", 400));
  }

  await User.findByIdAndUpdate(currentUserId, {
    $pull: { following: userIdToUnfollow },
  });
  await User.findByIdAndUpdate(userIdToUnfollow, {
    $pull: { followers: currentUserId },
  });

  res.status(200).json({
    status: "success",
    message: "User unfollowed successfully",
  });
});

module.exports = {
  deleteUser,
  updateUserProfile,
  getUsers,
  unfollowUser,
  followUser,
  getUserById,
};
