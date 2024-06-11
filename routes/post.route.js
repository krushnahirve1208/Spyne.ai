const express = require('express');
const router = express.Router();
const PostController = require('../controllers/post.controller');

router.post('/', PostController.create);
router.get('/:postId', PostController.getPost);
router.put('/:postId', PostController.update);
router.delete('/:postId', PostController.delete);
router.post('/:postId/like', PostController.like);
router.post('/:postId/comment', PostController.comment);

module.exports = router;
