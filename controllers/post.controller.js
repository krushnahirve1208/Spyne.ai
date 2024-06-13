const Post = require("../models/post.model");
const fs = require("fs").promises; // Using promises-based fs module for async operations
const asyncHandler = require("express-async-handler");
const AppError = require("../utils/appError");

const createPost = asyncHandler(async (req, res, next) => {
  const post = new Post({
    userId: req.user._id,
    text: req.body.text,
    image: req.file ? req.file.path : undefined,
    hashtags: req.body.hashtags ? req.body.hashtags.split(",") : [],
  });

  await post.save();
  res.status(201).json({ status: "success", data: { post } });
});

const getPostById = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.postId)
    .populate("userId", "username")
    .populate("likes", "username")
    .populate({
      path: "comments",
      populate: {
        path: "userId",
        select: "username",
      },
    })
    .populate({
      path: "comments.replies",
      populate: {
        path: "userId",
        select: "username",
      },
    });

  if (!post) {
    return next(new AppError("Post not found", 404));
  }

  res.status(200).json({ status: "success", data: { post } });
});

const updatePost = asyncHandler(async (req, res, next) => {
  const postId = req.params.postId;
  const updateData = req.body;

  const post = await Post.findById(postId);
  if (!post) {
    return next(new AppError("Post not found", 404));
  }

  // Check if the current user is the creator of the post
  if (post.userId.toString() !== req.user._id.toString()) {
    return next(
      new AppError("You are not authorized to update this post", 403)
    );
  }

  // Update image path if a new file is uploaded
  if (req.file) {
    updateData.image = req.file.path;

    // Delete old image file if it exists
    if (post.image) {
      await fs.unlink(post.image);
    }
  }

  // Update the post
  const updatedPost = await Post.findByIdAndUpdate(postId, updateData, {
    new: true,
  });
  res.status(200).json({ status: "success", data: { post: updatedPost } });
});

const deletePost = asyncHandler(async (req, res, next) => {
  const postId = req.params.postId;

  const post = await Post.findById(postId);
  if (!post) {
    return next(new AppError("Post not found", 404));
  }

  if (post.userId.toString() !== req.user._id.toString()) {
    return next(
      new AppError("You are not authorized to delete this post", 403)
    );
  }

  await Post.findByIdAndDelete(postId);

  if (post.image) {
    await fs.unlink(post.image);
  }

  res.status(204).json({ status: "success" });
});

const likePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.postId);
  if (!post) {
    return next(new AppError("Post not found", 404));
  }

  if (!post.likes.includes(req.user._id)) {
    post.likes.push(req.user._id);
    await post.save();
  }

  res.status(200).json({ status: "success", data: { post } });
});

const getPosts = asyncHandler(async (req, res, next) => {
  const { hashtags, text } = req.query;
  let searchCriteria = {};

  if (hashtags) {
    const hashtagsArray = hashtags.split(",");
    if (hashtagsArray.length > 0) {
      searchCriteria.hashtags = { $all: hashtagsArray };
    }
  }

  if (text) {
    searchCriteria.text = new RegExp(text, "i");
  }

  const posts = await Post.find(searchCriteria)
    .populate("userId", "username")
    .populate("likes", "username")
    .populate({
      path: "comments",
      populate: {
        path: "userId",
        select: "username",
      },
    })
    .populate({
      path: "comments.replies",
      populate: {
        path: "userId",
        select: "username",
      },
    });

  res.status(200).json({ status: "success", data: { posts } });
});

const unlikePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return next(new AppError("Post not found", 404));
    }

    // Check if the user has liked the post
    if (post.likes.includes(req.user._id)) {
      post.likes = post.likes.filter(
        (like) => like.toString() !== req.user._id.toString()
      );
      await post.save();
    }

    res.status(200).json({ status: "success", data: { post } });
  } catch (error) {
    console.error("Error unliking post:", error);
    next(new AppError("Failed to unlike post", 500));
  }
};

module.exports = {
  createPost,
  getPostById,
  getPosts,
  deletePost,
  updatePost,
  likePost,
  unlikePost,
};
