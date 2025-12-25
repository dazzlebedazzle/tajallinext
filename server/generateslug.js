const mongoose = require("mongoose");
const slugify = require("slugify");
const Product = require("./models/productModel"); // Import your Product model

mongoose.connect("mongodb://tuser:LalitAmit7014@213.210.37.238:27017/yourDatabase?authSource=admin", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB");
  generateSlugs();
}).catch(err => console.error("MongoDB Connection Error:", err));

async function generateSlugs() {
  try {
    const products = await Product.find({ slug: { $exists: false } }); // Find products without slugs

    for (let product of products) {
      // Extract text before the first "|"
      let titlePart = product.title.split("|")[0].trim(); 

      // Generate slug
      let slug = slugify(titlePart, { lower: true, strict: true });

      // Ensure uniqueness
      let existingProduct = await Product.findOne({ slug });
      let count = 1;
      while (existingProduct) {
        slug = `${slug}-${count}`;
        existingProduct = await Product.findOne({ slug });
        count++;
      }

      // Update product slug
      await Product.updateOne({ _id: product._id }, { $set: { slug } });
      console.log(`Updated product: ${product.title} -> ${slug}`);
    }

    console.log("Slugs generated successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error updating slugs:", error);
    mongoose.connection.close();
  }
}



const mongoose = require("mongoose");
const Blog = require("./models/blogModel"); // Adjust the path if needed

// MongoDB Connection
mongoose
  .connect("mongodb://tuser:LalitAmit7014@213.210.37.238:27017/yourDatabase?authSource=admin", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Function to Generate Slug
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .substring(0, 100); // Limit slug length
};

const updateBlogsWithSlug = async () => {
  try {
    const blogs = await Blog.find(); // Fetch all blogs
    for (let blog of blogs) {
      if (!blog.slug) { // Only update if slug is missing
        const slug = generateSlug(blog.title);
        await Blog.findByIdAndUpdate(blog._id, { slug });
        console.log(`Updated blog: ${blog.title} -> ${slug}`);
      }
    }
    console.log("Slug update complete.");
    mongoose.disconnect();
  } catch (error) {
    console.error("Error updating blogs:", error);
    mongoose.disconnect();
  }
};

updateBlogsWithSlug();
