const express = require("express");
const router = express.Router();
const upload = require("../config/multer.config.js");
const { protectRoute } = require("../controllers/auth.controller");

const {
  createPost,
  getPostById,
  getPosts,
  deletePost,
  updatePost,
  likePost,
  commentPost,
} = require("../controllers/post.controller.js");
router.use(protectRoute);

router.post("/", upload.single("image"), createPost);
router.get("/", getPosts);

router.get("/:postId", getPostById);
router.patch("/:postId", upload.single("image"), updatePost);
router.delete("/:postId", deletePost);
router.post("/:postId/like", likePost);
router.post("/:postId/comment", commentPost);

module.exports = router;
