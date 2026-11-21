const fs = require("fs");
const Blog = require("../models/blogModel");
const slugify = require("slugify");
const mongoose = require("mongoose");
const cloudinaryuploadImg = require("../utils/cloudinary");

// Posts created before draft support have no `status` field; they count as published.
const PUBLISHED_FILTER = { status: { $ne: "draft" } };

// Fields the admin may set. Anything else in the body is ignored.
const EDITABLE_FIELDS = ["title", "desc", "content", "author", "imageAlt", "metaTitle", "metaDescription"];

const toSlug = (text) => slugify(String(text || "").split("|")[0].trim(), { lower: true, strict: true });

const parseTags = (tags) => {
  if (tags === undefined || tags === null) return undefined;
  const list = Array.isArray(tags) ? tags : String(tags).split(",");
  return [...new Set(list.map((t) => String(t).trim().toLowerCase()).filter(Boolean))];
};

const parseStatus = (status) => (status === "published" || status === "draft" ? status : undefined);

// Unique slug: "my-post", then "my-post-2", "my-post-3"... (ignoring the post being edited)
const uniqueSlug = async (base, excludeId) => {
  const root = base || `post-${Date.now()}`;
  let candidate = root;
  for (let n = 2; ; n++) {
    const clash = await Blog.findOne({ slug: candidate, ...(excludeId ? { _id: { $ne: excludeId } } : {}) }).select("_id");
    if (!clash) return candidate;
    candidate = `${root}-${n}`;
  }
};

const uploadImage = async (file) => {
  try {
    const { url } = await cloudinaryuploadImg(file.path);
    return url;
  } finally {
    fs.unlink(file.path, () => {}); // don't keep local copies
  }
};

const pick = (body) =>
  EDITABLE_FIELDS.reduce((acc, key) => {
    if (body[key] !== undefined) acc[key] = typeof body[key] === "string" ? body[key].trim() : body[key];
    return acc;
  }, {});

const sendError = (res, error) => {
  if (error?.code === 11000) return res.status(409).json({ message: "A post with this slug already exists" });
  if (error?.name === "ValidationError") return res.status(400).json({ message: error.message });
  console.error("Blog error:", error);
  return res.status(500).json({ message: "Something went wrong" });
};

// ---------- Admin ----------

// POST /api/blogs/createBlog  (multipart, field "image")
const createBlog = async (req, res) => {
  try {
    const body = req.body || {};
    if (!req.file) return res.status(400).json({ message: "Image is required" });
    for (const field of ["title", "desc", "content", "author"]) {
      if (!String(body[field] || "").trim()) return res.status(400).json({ message: `${field} is required` });
    }

    const status = parseStatus(body.status) || "draft";
    const post = new Blog({
      ...pick(body),
      tags: parseTags(body.tags) || [],
      status,
      publishedAt: status === "published" ? new Date() : undefined,
      slug: await uniqueSlug(toSlug(body.slug || body.title)),
      image: await uploadImage(req.file),
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    sendError(res, error);
  }
};

// PUT /api/blogs/updateBlog/:id  (JSON or multipart; "image" optional)
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: "Blog post not found" });
    const post = await Blog.findById(id);
    if (!post) return res.status(404).json({ message: "Blog post not found" });

    const body = req.body || {};
    Object.assign(post, pick(body));

    const tags = parseTags(body.tags);
    if (tags) post.tags = tags;

    // The URL only changes when the admin edits the slug explicitly, so published links stay stable
    if (body.slug !== undefined && toSlug(body.slug) && toSlug(body.slug) !== post.slug) {
      post.slug = await uniqueSlug(toSlug(body.slug), post._id);
    }

    const status = parseStatus(body.status);
    if (status) {
      if (status === "published" && !post.publishedAt) {
        // Older posts (no status field) were live from creation, so keep their original date
        post.publishedAt = post.status ? new Date() : post.createdAt;
      }
      post.status = status;
    }

    if (req.file) post.image = await uploadImage(req.file);

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    sendError(res, error);
  }
};

// DELETE /api/blogs/deleteBlog/:id
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: "Blog post not found" });
    const deleted = await Blog.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Blog post not found" });
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    sendError(res, error);
  }
};

// GET /api/blogs/admin/all  — every post including drafts, without content
const getAllBlogsAdmin = async (req, res) => {
  try {
    const posts = await Blog.find().select("-content").sort({ updatedAt: -1 });
    res.status(200).json(posts.map((p) => ({ ...p.toObject(), status: p.status || "published" })));
  } catch (error) {
    sendError(res, error);
  }
};

// GET /api/blogs/admin/:id — full post for the editor (drafts included)
const getBlogByIdAdmin = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(404).json({ message: "Blog post not found" });
    const post = await Blog.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Blog post not found" });
    res.status(200).json({ ...post.toObject(), status: post.status || "published" });
  } catch (error) {
    sendError(res, error);
  }
};

// ---------- Public (published posts only) ----------

// GET /api/blogs/getBlog — list without the full content (lighter for list pages and the sitemap)
const getAllBlogs = async (req, res) => {
  try {
    const posts = await Blog.find(PUBLISHED_FILTER).select("-content").sort({ publishedAt: -1, createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    sendError(res, error);
  }
};

// GET /api/blogs/getBlogId/:id
const getBlogById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(404).json({ message: "Blog post not found" });
    const post = await Blog.findOne({ _id: req.params.id, ...PUBLISHED_FILTER });
    if (!post) return res.status(404).json({ message: "Blog post not found" });
    res.status(200).json(post);
  } catch (error) {
    sendError(res, error);
  }
};

// GET /api/blogs/getBlogSlug/:slug  (also accepts an id for old links)
const getBlogBySlug = async (req, res) => {
  try {
    const slug = String(req.params.slug || "");
    const normalizedSlug = slugify(decodeURIComponent(slug), { lower: true, strict: true });
    const match = mongoose.Types.ObjectId.isValid(slug)
      ? { _id: slug }
      : { $or: [{ slug }, { slug: normalizedSlug }] };
    const post = await Blog.findOne({ $and: [match, PUBLISHED_FILTER] });
    if (!post) return res.status(404).json({ message: "Blog post not found" });
    res.status(200).json(post);
  } catch (error) {
    sendError(res, error);
  }
};

// GET /api/blogs/getBlogTag/:tag — empty array when nothing matches
const getBlogsByTag = async (req, res) => {
  try {
    const tag = decodeURIComponent(String(req.params.tag || "")).replace(/-/g, " ").trim().toLowerCase();
    const posts = await Blog.find({ tags: tag, ...PUBLISHED_FILTER })
      .select("-content")
      .sort({ publishedAt: -1, createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    sendError(res, error);
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  updateBlog,
  deleteBlog,
  getBlogById,
  getBlogsByTag,
  getBlogBySlug,
  getAllBlogsAdmin,
  getBlogByIdAdmin,
};
