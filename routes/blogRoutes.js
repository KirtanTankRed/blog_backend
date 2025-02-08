const express = require('express');
const {createBlog} = require('../controllers/blogController');
const checkRole = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const blogRoute = express.Router();
const {getallBlogs} = require('../controllers/blogController');
const {getBlogbyID} = require('../controllers/blogController');

//POST: Create a blog (Only Bloggers and Admins)
blogRoute.post("/", checkRole("blogger"), upload.single("image"), createBlog);

// GET: Fetch paginated blogs (Allowed: Admin, blogger and Reader)
blogRoute.get("/", checkRole("admin", "blogger", "reader"), getallBlogs);

//GET: Get blog by id
// blogRoute.get("/:id", checkRole("admin", "blogger", "reader"), getBlogbyID);
blogRoute.get("/:id", getBlogbyID);

module.exports = blogRoute;