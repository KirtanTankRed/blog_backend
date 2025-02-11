const express = require('express');
const checkRole = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/authMiddleware');
const {createBlog, getallBlogs, getBlogbyID, updateBlog, deleteBlog} = require('../controllers/blogController');
const blogRoute = express.Router();



//POST: Create a blog (Only Bloggers and Admins)
blogRoute.post("/", checkRole("blogger", "admin"), uploadMiddleware, createBlog);

// GET: Fetch paginated blogs (Allowed: Admin, blogger and Reader)
blogRoute.get("/", checkRole("blogger", "reader", "admin"), getallBlogs);

//GET: Get blog by id
blogRoute.get("/:id", checkRole("blogger", "reader","admin"), getBlogbyID);

//PUT: Update a blog
blogRoute.put("/:id", checkRole("blogger", "admin"), uploadMiddleware, updateBlog);

//DELETE: Delete a blog
blogRoute.delete("/:id", checkRole("blogger", "admin"), deleteBlog);

module.exports = blogRoute;