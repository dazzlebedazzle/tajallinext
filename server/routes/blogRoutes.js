const express = require("express");
const {createBlog,getAllBlogs,getBlogById,updateBlog,deleteBlog,getBlogsByTag,getBlogBySlug} = require("../controllers/blogCtrl")
const {uploadPhoto} = require("../middleware/uploadImg");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

console.log(createBlog,"blogggg")
router.post("/createBlog", authMiddleware, uploadPhoto.single("image"), createBlog);
router.get("/getBlog", getAllBlogs);
router.get("/getBlogId/:id", getBlogById);
router.get("/getBlogSlug/:slug", getBlogBySlug);
router.put("/updateBlog/:id", authMiddleware, updateBlog);
router.delete("/deleteBlog/:id", authMiddleware, deleteBlog);
router.get("/getBlogTag/:tag",getBlogsByTag)

module.exports = router;
