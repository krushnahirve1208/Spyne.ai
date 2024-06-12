const Comment = require("../models/comment.model");
const Post = require("../models/post.model");

// Create a new comment
exports.createComment = async (req, res) => {
  try {
    const { postId, text } = req.body;
    const userId = req.user.id;

    const comment = await Comment.create({ postId, userId, text });

    await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } });

    res.status(201).json({ status: "success", data: comment });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Reply to a comment
exports.replyToComment = async (req, res) => {
  try {
    const { commentId, text } = req.body;
    const userId = req.user.id;

    const reply = await Comment.create({
      postId: req.params.postId,
      userId,
      text,
    });

    await Comment.findByIdAndUpdate(commentId, {
      $push: { replies: reply._id },
    });

    res.status(201).json({ status: "success", data: reply });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Like a comment
exports.likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment.likes.includes(req.user.id)) {
      comment.likes.push(req.user.id);
      await comment.save();
    }

    res.status(200).json({ status: "success", data: comment });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Update a comment
exports.updateComment = async (req, res) => {
  try {
    const { text } = req.body;
    const comment = await Comment.findById(req.params.commentId);

    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({
        status: "fail",
        message: "You are not allowed to update this comment",
      });
    }

    comment.text = text;
    await comment.save();

    res.status(200).json({ status: "success", data: comment });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({
        status: "fail",
        message: "You are not allowed to delete this comment",
      });
    }

    await Comment.findByIdAndDelete(req.params.commentId);
    await Post.findByIdAndUpdate(comment.postId, {
      $pull: { comments: req.params.commentId },
    });

    res.status(204).json({ status: "success", data: null });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Get comments for a post
exports.getCommentsForPost = async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).populate(
      "userId",
      "name"
    );

    res.status(200).json({ status: "success", data: comments });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
