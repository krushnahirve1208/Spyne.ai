const Post = require("../models/post.model");
const fs = require("fs");

const createPost = async (req, res) => {
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
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ post: post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePost = async (req, res) => {
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
    console.log(updateData);
    await Post.findByIdAndUpdate(req.params.postId, updateData);
    res.status(200).json({ message: "Post updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deletePost = async (req, res) => {
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
};

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (!post.likes.includes(req.user._id)) {
      post.likes.push(req.user._id);
      await post.save();
    }
    res.status(200).json({ message: "Post liked successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const commentPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    post.comments.push({
      userId: req.user._id,
      text: req.body.text,
    });
    await post.save();
    res.status(200).json({ message: "Comment added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// const getPosts = async (req, res) => {
//   try {
//     const { hashtags, text } = req.query;

//     let searchCriteria = {};

//     if (hashtags) {
//       const hashtagsArray = hashtags.split(",");
//       console.log(hashtagsArray);
//       if (Array.isArray(hashtagsArray) && hashtagsArray.length > 0) {
//         searchCriteria.hashtags = { $all: hashtagsArray };
//       }
//     }

//     if (text) {
//       searchCriteria.text = new RegExp(text, "i"); // 'i' for case-insensitive
//     }

//     // Perform the search based on the criteria
//     const posts = await Post.find(searchCriteria)
//       .populate("userId", "username") // Populate the userId with the username field from User model
//       .populate("likes", "username") // Populate the likes with the username field from User model
//       .populate("comments.userId", "username"); // Populate the comments' userId with the username field from User model

//     // Return the found posts
//     res.status(200).json({ data: posts });
//   } catch (error) {
//     // Handle errors
//     console.error(error);
//     res
//       .status(500)
//       .json({ error: "An error occurred while searching for posts" });
//   }
// };

const getPosts = async (req, res) => {
  try {
    const { hashtags, text } = req.query;

    let searchCriteria = {};

    if (hashtags) {
      const hashtagsArray = hashtags.split(",");
      if (hashtagsArray.length > 0) {
        searchCriteria.hashtags = { $all: hashtagsArray };
      }
    }

    if (text) {
      searchCriteria.text = new RegExp(text, "i"); // 'i' for case-insensitive
    }

    // Perform the search based on the criteria
    const posts = await Post.find(searchCriteria)
      .populate("userId", "username") // Populate the userId with the username field from User model
      .populate("likes", "username") // Populate the likes with the username field from User model
      .populate({
        path: "comments",
        populate: {
          path: "userId",
          select: "username",
        },
      }) // Populate the comments' userId with the username field from User model
      .populate({
        path: "comments.replies",
        populate: {
          path: "userId",
          select: "username",
        },
      }); // Populate the replies' userId with the username field from User model

    // Return the found posts
    res.status(200).json({ data: posts });
  } catch (error) {
    // Handle errors
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while searching for posts" });
  }
};

module.exports = {
  createPost,
  getPostById,
  getPosts,
  deletePost,
  updatePost,
  likePost,
  commentPost,
};
