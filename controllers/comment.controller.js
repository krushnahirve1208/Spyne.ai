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

    if (!comment.likes.includes(req.user._id)) {
      comment.likes.push(req.user._id);
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

    const { text } = req.body;
    const userId = req.user._id;
    if (!text) {
      return res.status(400).json({ message: "Text is required for reply" });
    }

    // Create a new comment document for the reply
    const newReply = await Comment.create({
      postId: req.params.postId,
      userId,
      text,
      createdAt: new Date(),
    });

    // Check if the reply text is empty
    if (!newReply.text) {
      throw new Error("Reply text is missing!"); // Or send a specific error response
    }

    // Push the new reply's ID into the replies array of the parent comment
    comment.replies.push(newReply._id);

    // Save the parent post to persist the changes
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
    console.log(req.body);
    console.log(req.params.postId);
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = new Comment({
      postId: req.params.postId,
      userId: req.user._id,
      text: req.body.text,
    });

    await newComment.save();

    post.comments.push(newComment);
    await post.save();

    res
      .status(201)
      .json({ message: "Comment created successfully", comment: newComment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a comment
const updateComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    comment.text = req.body.text || comment.text;

    await post.save();

    res.status(200).json({ message: "Comment updated successfully", comment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Remove the comment from the post
    post.comments.remove(req.params.commentId);
    await post.save();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
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

const getCommentById = async (req, res) => {
  try {
    const postId = req.params.postId;
    const commentId = req.params.commentId;

    // Find the post by postId
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Find the comment by commentId within the post
    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Return the comment
    res.status(200).json({ data: comment });
  } catch (error) {
    // Handle errors
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the comment" });
  }
};

module.exports = {
  likeComment,
  replyToComment,
  getCommentsForPost,
  deleteComment,
  createComment,
  updateComment,
  getCommentById,
};
