const Comment = require("../models/comment.model");
const Post = require("../models/post.model");
const asyncHandler = require("express-async-handler");
const AppError = require("../utils/appError");

const likeComment = asyncHandler(async (req, res) => {
  const postId = req.params.postId;
  const commentId = req.params.commentId;

  const post = await Post.findById(postId);
  if (!post) {
    return next(new AppError("Post not found", 404));
  }

  const comment = post.comments.id(commentId);
  if (!comment) {
    return next(new AppError("Comment not found", 404));
  }

  if (!comment.likes.includes(req.user._id)) {
    comment.likes.push(req.user._id);
    await post.save();
  }

  res.status(200).json({
    status: "success",
    data: { message: "Comment liked successfully" },
  });
});

const replyToComment = asyncHandler(async (req, res) => {
  const postId = req.params.postId;
  const commentId = req.params.commentId;

  const post = await Post.findById(postId);
  if (!post) {
    return next(new AppError("Post not found", 404));
  }

  const comment = post.comments.id(commentId);
  if (!comment) {
    return next(new AppError("Comment not found", 404));
  }

  const { text } = req.body;
  const userId = req.user._id;
  if (!text) {
    return next(new AppError("Text is required for reply", 400));
  }

  const newReply = await Comment.create({
    postId,
    userId,
    text,
    createdAt: new Date(),
  });

  comment.replies.push(newReply._id);
  await post.save();

  res.status(201).json({
    status: "success",
    data: { message: "Replied to comment successfully", reply: newReply },
  });
});

const createComment = asyncHandler(async (req, res) => {
  const postId = req.params.postId;

  const post = await Post.findById(postId);
  if (!post) {
    return next(new AppError("Post not found", 404));
  }

  const newComment = new Comment({
    postId,
    userId: req.user._id,
    text: req.body.text,
  });

  await newComment.save();
  post.comments.push(newComment);
  await post.save();

  res.status(201).json({
    status: "success",
    data: { message: "Comment created successfully", comment: newComment },
  });
});

const updateComment = asyncHandler(async (req, res) => {
  const postId = req.params.postId;
  const commentId = req.params.commentId;

  const post = await Post.findById(postId);
  if (!post) {
    return next(new AppError("Post not found", 404));
  }

  const comment = post.comments.id(commentId);
  if (!comment) {
    return next(new AppError("Comment not found", 404));
  }

  comment.text = req.body.text || comment.text;
  await post.save();

  res.status(200).json({
    status: "success",
    data: { message: "Comment updated successfully", comment },
  });
});

const deleteComment = asyncHandler(async (req, res) => {
  const postId = req.params.postId;
  const commentId = req.params.commentId;

  const post = await Post.findById(postId);
  if (!post) {
    return next(new AppError("Post not found", 404));
  }

  const comment = post.comments.id(commentId);
  if (!comment) {
    return next(new AppError("Comment not found", 404));
  }

  post.comments.remove(commentId);
  await post.save();

  res.status(200).json({
    status: "success",
    data: { message: "Comment deleted successfully" },
  });
});

const getCommentsForPost = asyncHandler(async (req, res) => {
  const postId = req.params.postId;

  const comments = await Comment.find({ postId }).populate("userId", "name");

  res.status(200).json({ status: "success", data: comments });
});

const getCommentById = asyncHandler(async (req, res) => {
  const postId = req.params.postId;
  const commentId = req.params.commentId;

  const post = await Post.findById(postId);
  if (!post) {
    return next(new AppError("Post not found", 404));
  }

  const comment = post.comments.id(commentId);
  if (!comment) {
    return next(new AppError("Comment not found", 404));
  }

  res.status(200).json({ status: "success", data: { comment } });
});

module.exports = {
  likeComment,
  replyToComment,
  getCommentsForPost,
  deleteComment,
  createComment,
  updateComment,
  getCommentById,
};
