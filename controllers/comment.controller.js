const Comment = require("../models/comment.model");
const Post = require("../models/post.model");
const asyncHandler = require("express-async-handler");
const AppError = require("../utils/appError");

const likeComment = asyncHandler(async (req, res) => {
  const postId = req.params.postId;
  const commentId = req.params.commentId;

  const post = await Post.findById(postId).populate("comments");
  console.log(post);
  if (!post) {
    return next(new AppError("Post not found", 404));
  }

  const comment = post.comments.find(
    (comment) => comment._id.toString() === commentId
  );
  if (!comment) {
    return next(new AppError("Comment not found", 404));
  }

  if (!comment.likes.includes(req.user._id)) {
    comment.likes.push(req.user._id);
    await comment.save();
  }

  res.status(200).json({
    status: "success",
    data: { message: "Comment liked successfully" },
  });
});

const unlikeComment = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const commentId = req.params.commentId;

    const post = await Post.findById(postId).populate("comments");

    if (!post) {
      return next(new AppError("Post not found", 404));
    }

    const comment = post.comments.find(
      (comment) => comment._id.toString() === commentId
    );

    if (!comment) {
      return next(new AppError("Comment not found", 404));
    }
    // Check if the user has liked the comment
    if (comment.likes.includes(req.user._id)) {
      comment.likes.pull(req.user._id);
      await comment.save();
    }

    res.status(200).json({
      status: "success",
      data: { message: "Comment unliked successfully" },
    });
  } catch (error) {
    console.error("Error unliking comment:", error);
    next(new AppError("Failed to unlike comment", 500));
  }
};

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

  const post = await Post.findById(postId).populate("comments");
  if (!post) {
    return next(new AppError("Post not found", 404));
  }

  const comment = post.comments.find(
    (comment) => comment._id.toString() === commentId
  );

  if (!comment) {
    return next(new AppError("Comment not found", 404));
  }

  comment.text = req.body.text || comment.text;
  await comment.save();

  res.status(200).json({
    status: "success",
    data: { message: "Comment updated successfully", comment },
  });
});

const deleteComment = asyncHandler(async (req, res, next) => {
  const { postId, commentId } = req.params;

  // Find the post by its ID
  const post = await Post.findById(postId);
  if (!post) {
    return next(new AppError("Post not found", 404));
  }

  // Find the comment within the post's comments array
  const comment = post.comments.find(
    (comment) => comment._id.toString() === commentId
  );

  if (!comment) {
    return next(new AppError("Comment not found", 404));
  }

  // Remove the comment from the post's comments array
  post.comments.pull(commentId);
  await post.save();

  // Also remove the comment from the Comment collection
  await Comment.findByIdAndDelete(commentId);

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

const getCommentById = asyncHandler(async (req, res, next) => {
  const { postId, commentId } = req.params;

  // Check if the post exists
  const post = await Post.findById(postId).populate("comments");
  if (!post) {
    return next(new AppError("Post not found", 404));
  }

  // Find the comment directly in the Comment collection
  const comment = post.comments.find(
    (comment) => comment._id.toString() === commentId
  );

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
  unlikeComment,
};
