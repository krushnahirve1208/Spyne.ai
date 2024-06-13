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
  unlikeComment,
} = require("../controllers/comment.controller");

const { protectRoute } = require("../controllers/auth.controller");

router.post("/", protectRoute, createComment);

router.post("/:commentId/reply", protectRoute, replyToComment);

router.post("/:commentId/like", protectRoute, likeComment);
router.route("/:commentId/unlike").post(protectRoute, unlikeComment);

router.patch("/:commentId", protectRoute, updateComment);

router.delete("/:commentId", protectRoute, deleteComment);

router.get("/:commentId", protectRoute, getCommentById);
module.exports = router;
