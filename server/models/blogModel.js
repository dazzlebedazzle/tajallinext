const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    desc: { type: String, required: true, trim: true }, // short description / excerpt
    content: { type: String, required: true }, // Markdown
    image: { type: String, required: true },
    imageAlt: { type: String, trim: true },
    author: { type: String, required: true, trim: true },
    tags: [{ type: String, trim: true, lowercase: true }],
    slug: { type: String, unique: true, index: true },
    // Older posts have no status: they are treated as published (see PUBLISHED_FILTER in blogCtrl)
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    publishedAt: { type: Date },
    // SEO overrides; fall back to title / desc when empty
    metaTitle: { type: String, trim: true },
    metaDescription: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
