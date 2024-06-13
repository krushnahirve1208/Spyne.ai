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
  unlikePost,
} = require("../controllers/post.controller.js");

router.get("/", getPosts);
router.get("/:postId", getPostById);

router.use(protectRoute);

router.patch("/:postId", upload.single("image"), updatePost);
router.delete("/:postId", deletePost);
router.post("/:postId/like", likePost);
router.post("/", upload.single("image"), createPost);
router.route("/:postId/unlike", unlikePost);
module.exports = router;
