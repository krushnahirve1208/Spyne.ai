const Post = require('../models/post.model');

const PostController = {
  create: async (req, res) => {
    try {
      const post = new Post({
        userId: req.body.userId,
        text: req.body.text,
        image: req.body.image,
        hashtags: req.body.hashtags
      });

      await post.save();
      res.status(201).json({ message: 'Post created successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      res.status(200).json({ post: post });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      await Post.findByIdAndUpdate(req.params.postId, req.body);
      res.status(200).json({ message: 'Post updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      await Post.findByIdAndDelete(req.params.postId);
      res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  like: async (req, res) => {
    try {
      const post = await Post.findById(req.params.postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      if (!post.likes.includes(req.body.userId)) {
        post.likes.push(req.body.userId);
        await post.save();
      }
      res.status(200).json({ message: 'Post liked successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  comment: async (req, res) => {
    try {
      const post = await Post.findById(req.params.postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      post.comments.push({
        userId: req.body.userId,
        text: req.body.text
      });
      await post.save();
      res.status(200).json({ message: 'Comment added successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = PostController;
