const express = require('express');
const {createBlog} = require('../controllers/blogController');
const checkRole = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');
const blogRoute = express.Router();
const {getallBlogs} = require('../controllers/blogController');
const {getBlogbyID} = require('../controllers/blogController');
const {updateBlog} = require('../controllers/blogController');
const {deleteBlog} = require('../controllers/blogController');

//POST: Create a blog (Only Bloggers and Admins)
blogRoute.post("/", checkRole("blogger"), uploadMiddleware, createBlog);

// GET: Fetch paginated blogs (Allowed: Admin, blogger and Reader)
blogRoute.get("/", checkRole("blogger", "reader"), getallBlogs);

//GET: Get blog by id
blogRoute.get("/:id", checkRole("blogger", "reader"), getBlogbyID);

//PUT: Update a blog
blogRoute.put("/:id", checkRole("blogger"), uploadMiddleware, updateBlog);

//DELETE: Delete a blog
blogRoute.delete("/:id", checkRole("blogger"), deleteBlog);

module.exports = blogRoute;