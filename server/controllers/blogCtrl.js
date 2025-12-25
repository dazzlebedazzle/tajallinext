const Blog = require("../models/blogModel");
const slugify = require("slugify");
const cloudinaryuploadImg = require("../utils/cloudinary");

// Create a new blog post

const createBlog = async (req, res) => {
  try {
    const { title, content, author , tags,desc} = req.body;
    console.log("Body:", req.body);
    console.log("File received:", req.file);

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    // Upload file path to Cloudinary
    const result = await cloudinaryuploadImg(req.file.path); // ✅ Use file path instead of buffer

    const processedTags = Array.isArray(tags)
    ? tags.map(tag => tag.toLowerCase())
    : tags.split(',').map(tag => tag.trim().toLowerCase());

    const newPost = new Blog({
      title,
      content,
      author,
      tags : processedTags,
      desc,
      image: result.url, // ✅ Use correct Cloudinary response property
      slug: slugify(title, { lower: true, strict: true }),
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Errorsss:", error.message);
    res.status(500).json({ error: error.message });
  }
};


// Get all blog posts
const getAllBlogs = async (req, res) => {
  try {
    const posts = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single blog post
const getBlogById = async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Blog post not found" });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//get by slug
const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await Blog.findOne({ slug: slug });
    if (!post) return res.status(404).json({ message: "Blog post not found" });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update blog post
const updateBlog = async (req, res) => {
  try {
    const updatedPost = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete blog post
const deleteBlog = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get blogs by tag
const getBlogsByTag = async (req, res) => {
  try {
    const { tag } = req.params;
    const posts = await Blog.find({ tags: tag });
    if (posts.length === 0) return res.status(404).json({ message: "No blogs found with this tag" });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createBlog, getAllBlogs,updateBlog,deleteBlog,getBlogById,getBlogsByTag,getBlogBySlug
};
