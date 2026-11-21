const express = require("express");
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getBlogsByTag,
  getBlogBySlug,
  getAllBlogsAdmin,
  getBlogByIdAdmin,
} = require("../controllers/blogCtrl");
const { uploadPhoto } = require("../middleware/uploadImg");
const { authMiddleware, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// Admin (drafts included)
router.get("/admin/all", authMiddleware, admin, getAllBlogsAdmin);
router.get("/admin/:id", authMiddleware, admin, getBlogByIdAdmin);
router.post("/createBlog", authMiddleware, admin, uploadPhoto.single("image"), createBlog);
router.put("/updateBlog/:id", authMiddleware, admin, uploadPhoto.single("image"), updateBlog);
router.delete("/deleteBlog/:id", authMiddleware, admin, deleteBlog);

// Public (published only)
router.get("/getBlog", getAllBlogs);
router.get("/getBlogId/:id", getBlogById);
router.get("/getBlogSlug/:slug", getBlogBySlug);
router.get("/getBlogTag/:tag", getBlogsByTag);
router.get("/:slug", getBlogBySlug);

module.exports = router;
