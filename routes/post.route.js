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
router.use(protectRoute);

router.post("/", upload.single("image"), createPost);
router.get("/", getPosts);

router.get("/:postId", getPostById);
router.patch("/:postId", upload.single("image"), updatePost);
router.delete("/:postId", deletePost);
router.post("/:postId/like", likePost);
router.route("/:postId/unlike").delete(protectRoute, unlikePost);
module.exports = router;
