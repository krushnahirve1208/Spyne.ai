const express = require("express");
const router = express.Router();
const PostController = require("../controllers/post.controller");
const upload = require("../config/multer.config.js");
const { protectRoute } = require("../controllers/auth.controller");

router.post("/", protectRoute, upload.single("image"), PostController.create);

router.get("/tags/:hashtags", PostController.getPostsWithTags);
router.get("/text/:search_text", PostController.getPostsWithText);

router.post("/:postId/comments/:commentId/like", PostController.likeComment);

router.get("/:postId", PostController.getPost);
router.put("/:postId", PostController.update);
router.delete("/:postId", PostController.delete);
router.post("/:postId/like", PostController.like);
router.post("/:postId/comment", PostController.comment);

module.exports = router;
