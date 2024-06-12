const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller");
const { protectRoute } = require("../controllers/auth.controller");

// Create a new comment
router.post("/", protectRoute, commentController.createComment);

// Reply to a comment
router.post(
  "/:commentId/reply",
  protectRoute,
  commentController.replyToComment
);

// Like a comment
router.post("/:commentId/like", protectRoute, commentController.likeComment);

// Update a comment
router.patch("/:commentId", protectRoute, commentController.updateComment);

// Delete a comment
router.delete("/:commentId", protectRoute, commentController.deleteComment);

// Get comments for a post
router.get("/:postId", protectRoute, commentController.getCommentsForPost);

module.exports = router;
