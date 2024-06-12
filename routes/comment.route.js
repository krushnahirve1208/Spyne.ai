const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  likeComment,
  replyToComment,
  getCommentsForPost,
  deleteComment,
  createComment,
  updateComment,
  getCommentById,
} = require("../controllers/comment.controller");

const { protectRoute } = require("../controllers/auth.controller");

// Create a new comment
router.post("/", protectRoute, createComment);

// Reply to a comment
router.post("/:commentId/reply", protectRoute, replyToComment);

// Like a comment
router.post("/:commentId/like", protectRoute, likeComment);

// Update a comment
router.patch("/:commentId", protectRoute, updateComment);

// Delete a comment
router.delete("/:commentId", protectRoute, deleteComment);

// Get comments for a post
// router.get("/:postId", protectRoute, getCommentsForPost);

router.get("/:commentId", protectRoute, getCommentById);
module.exports = router;
