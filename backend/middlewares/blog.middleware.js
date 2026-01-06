import Blog from "../models/blog.model.js";
import { ApiError } from "../utils/ApiError.js";

export const checkBlogOwnership = async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  if (blog.author.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to access this blog");
  }

  req.blog = blog; // attach blog to request
  next();
};
