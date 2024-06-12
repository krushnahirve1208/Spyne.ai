const express = require("express");
const router = express.Router();
const PostController = require("../controllers/post.controller");
const upload = require("../config/multer.config.js");
const { protectRoute } = require("../controllers/auth.controller");

const {
  createPost,
  getPostById,
  getPosts,
  deletePost,
  updatePost,
  likeComment,
  likePost,
  commentPost,
  replyToComment,
} = require("../controllers/post.controller.js");
router.use(protectRoute);

router.post("/", upload.single("image"), createPost);
router.get("/", PostController.getPosts);

router.get("/:postId", getPostById);
router.patch("/:postId", updatePost);
router.delete("/:postId", deletePost);
router.post("/:postId/like", likePost);
router.post("/:postId/comment", commentPost);

module.exports = router;
