const Comment = require("../models/comment.model");
const Post = require("../models/post.model");

const likeComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (!comment.likes.includes(req.body.userId)) {
      comment.likes.push(req.body.userId);
      await post.save();
    }

    res.status(200).json({ message: "Comment liked successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const replyToComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const newReply = {
      userId: req.body.userId,
      text: req.body.text,
      createdAt: new Date(),
    };

    comment.replies.push(newReply);
    await post.save();

    res
      .status(201)
      .json({ message: "Replied to comment successfully", reply: newReply });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new comment
const createComment = async (req, res) => {
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

// Update a comment
const updateComment = async (req, res) => {
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
const deleteComment = async (req, res) => {
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
const getCommentsForPost = async (req, res) => {
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

module.exports = {
  likeComment,
  replyToComment,
  getCommentsForPost,
  deleteComment,
  createComment,
  updateComment,
};
