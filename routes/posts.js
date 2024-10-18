const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find().populate("userId", "username avatar");
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Create new
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { imageUrl, text, userId } = req.body;

    if (!imageUrl || !text || !userId) {
      return res.status(400).json({
        message: "imageUrl, text, and userId are required.",
      });
    }

    const post = new Post({
      imageUrl,
      text,
      userId,
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Error creating post" });
  }
});

//Edit
router.put("/:id", authMiddleware, async (req, res) => {
  const { text, imageUrl } = req.body;
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    post.text = text || post.text;
    post.imageUrl = imageUrl || post.imageUrl;

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Post.findByIdAndDelete(post._id);
    res.json({ message: "Post deleted" });
  } catch (error) {
    console.error("Error in delete route:", error);
    res.status(500).json({ message: "An unexpected error occurred." });
  }
});

module.exports = router;
