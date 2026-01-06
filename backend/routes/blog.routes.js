import { Router } from "express";
import { verifyJWT, isAdmin } from "../middlewares/auth.middleware.js";
import { checkBlogOwnership } from "../middlewares/blog.middleware.js";
import {
  createBlog,
  getBlogs,
  getBlog,
  getAllBlogsPublic,
  updateBlog,
  deleteBlog
} from "../controllers/blog.controller.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();
router.get("/public", getAllBlogsPublic);
router.use(verifyJWT);
router.get("/get-blogs", getBlogs);
router.get("/get-blog/:id",getBlog)
router.post("/post",upload.single("image"),createBlog);
router.put("/edit-blog/:id", checkBlogOwnership,upload.single("image"),updateBlog);
router.delete("/delete-blog/:id", checkBlogOwnership,deleteBlog);

export default router;
