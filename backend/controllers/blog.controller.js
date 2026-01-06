import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Blog from "../models/blog.model.js";

/* =========================
   CREATE BLOG
========================= */
const createBlog = asyncHandler(async (req, res) => {
  const { title, content, summary } = req.body;

  if (!title || !content || !summary) {
    throw new ApiError(400, "Title and content are required");
  }

  let imagePath = req.file ? req.file.filename : null;
  if (req.file) {
    imagePath = req.file.filename; // path in uploads folder
  }

  const blog = await Blog.create({
    title,
    content,
    summary,
    image : imagePath,
    author: req.user._id 
  });

  const blogObj = blog.toObject();

if (blogObj.image) {
  blogObj.image = `${req.protocol}://${req.get("host")}/uploads/${blogObj.image}`;
}

res.status(201).json(
  new ApiResponse(201, blogObj, "Blog created successfully")
);

});


// GET all blogs (public)
const getAllBlogsPublic = asyncHandler(async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });

  res.status(200).json(
    new ApiResponse(200, blogs, "Public blogs fetched")
  );
});


/* =========================
   GET ALL BLOGS (OWN BLOGS)
========================= */
const getBlogs = asyncHandler(async (req, res) => {
  let blogs;

  if (req.user){
      blogs = await Blog.find({ author: req.user._id }).sort({ createdAt: -1 });
  }
  else{
     blogs = await Blog.find().sort({ createdAt: -1 });
  }
 
  res.status(200).json(new ApiResponse(200, blogs, "Blogs fetched successfully"));
});

/* =========================
   GET SINGLE BLOG
========================= */
const getBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({ _id: req.params.id, author: req.user._id });
  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }
  res.status(200).json(new ApiResponse(200, blog, "Blog fetched successfully"));
});

/* =========================
   UPDATE BLOG
========================= */
const updateBlog = asyncHandler(async (req, res) => {
  const { title, content,summary } = req.body;

  const blog = await Blog.findOne({ _id: req.params.id, author: req.user._id });
  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  blog.title = title || blog.title;
  blog.content = content || blog.content;
  blog.summary = summary || blog.summary;

  if (req.file) {
      blog.image = req.file.path; // or req.file.filename
    }
  await blog.save();

  res.status(200).json(new ApiResponse(200, blog, "Blog updated successfully"));
});





/* =========================
   DELETE BLOG
========================= */
const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findOneAndDelete({ _id: req.params.id, author: req.user._id });
  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  res.status(200).json(new ApiResponse(200, null, "Blog deleted successfully"));
});

export { createBlog, getBlogs, getAllBlogsPublic, getBlog, updateBlog, deleteBlog };
