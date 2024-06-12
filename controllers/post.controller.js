const Post = require("../models/post.model");
const fs = require("fs");

const parseHashtags = (query) => {
  let hashtags = query.hashtags;

  if (!hashtags) return [];

  if (typeof hashtags === "string") {
    if (hashtags.includes(",")) {
      return hashtags.split(",");
    }
    return [hashtags];
  }
};

const PostController = {
  create: async (req, res) => {
    try {
      const post = new Post({
        userId: req.user._id,
        text: req.body.text,
        image: req.file.path,
        hashtags: req.body.hashtags.split(","),
      });

      await post.save();
      res.status(201).json({ message: "Post created successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.status(200).json({ post: post });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const updateData = req.body;

      // If a new file is uploaded, add the file path to updateData
      if (req.file) {
        updateData.image = req.file.path;

        // Find the post to get the current image path
        const post = await Post.findById(req.params.postId);
        console.log(post);
        if (post && post.image) {
          // Delete the old image from the server
          const oldImagePath = `./${post.image}`;
          fs.unlink(oldImagePath, (unlinkErr) => {
            if (unlinkErr) {
              console.error(`Failed to delete old image: ${unlinkErr.message}`);
            }
          });
        }
      }

      await Post.findByIdAndUpdate(req.params.postId, updateData);
      res.status(200).json({ message: "Post updated successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      // Find the post by ID to get the image filename
      const post = await Post.findById(req.params.postId);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      // Delete the post from the database
      await Post.findByIdAndDelete(req.params.postId);

      // If the post has an image, delete the image file from the server
      if (post.image) {
        const imagePath = `./${post.image}`;
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error(`Failed to delete image: ${err.message}`);
          }
        });
      }

      res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  like: async (req, res) => {
    try {
      const post = await Post.findById(req.params.postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      if (!post.likes.includes(req.body.userId)) {
        post.likes.push(req.body.userId);
        await post.save();
      }
      res.status(200).json({ message: "Post liked successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  comment: async (req, res) => {
    try {
      const post = await Post.findById(req.params.postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      post.comments.push({
        userId: req.body.userId,
        text: req.body.text,
      });
      await post.save();
      res.status(200).json({ message: "Comment added successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  likeComment: async (req, res) => {
    try {
      const post = await Post.findById(req.params.postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      const comment = post.comments.id(req.params.commentId);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      if (!comment.likes.includes(req.body.userId)) {
        comment.likes.push(req.body.userId);
        await post.save();
      }

      res.status(200).json({ message: "Comment liked successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getPostsWithTags: async (req, res) => {
    try {
      // Extract hashtags from the request query parameters
      const hashtags = parseHashtags(req.query);

      // Check if hashtags are provided and is an array
      if (hashtags.length === 0 || !hashtags || !Array.isArray(hashtags)) {
        return res
          .status(400)
          .json({ error: "Hashtags should be provided as an array" });
      }

      // Search posts that contain any of the hashtags
      const posts = await Post.find({ hashtags: { $in: hashtags } })
        .populate("userId", "username") // Populate the userId with the username field from User model
        .populate("likes", "username") // Populate the likes with the username field from User model
        .populate("comments.userId", "username"); // Populate the comments' userId with the username field from User model

      // Return the found posts
      res.status(200).json(posts);
    } catch (error) {
      // Handle errors
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while searching for posts" });
    }
  },
  getPostsWithText: async (req, res) => {
    try {
      const { text } = req.query;

      if (!text) {
        return res.status(400).json({ error: "Text should be provided" });
      }

      const posts = await Post.find({ text: new RegExp(text, "i") }) // 'i' for case-insensitive
        .populate("userId", "username")
        .populate("likes", "username")
        .populate("comments.userId", "username");

      res.status(200).json(posts);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while searching for posts" });
    }
  },
  likeComment: async (req, res) => {
    try {
      const post = await Post.findById(req.params.postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      const comment = post.comments.id(req.params.commentId);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      if (!comment.likes.includes(req.body.userId)) {
        comment.likes.push(req.body.userId);
        await post.save();
      }

      res.status(200).json({ message: "Comment liked successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  replyToComment: async (req, res) => {
    try {
      const post = await Post.findById(req.params.postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      const comment = post.comments.id(req.params.commentId);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      const newReply = {
        userId: req.body.userId,
        text: req.body.text,
        createdAt: new Date(),
      };

      comment.replies.push(newReply);
      await post.save();

      res
        .status(201)
        .json({ message: "Replied to comment successfully", reply: newReply });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = PostController;
