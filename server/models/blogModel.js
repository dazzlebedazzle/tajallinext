const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    desc: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
    author: { type: String, required: true },
    tags:[{type: String, required:true}],
    slug: { type: String, unique: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
