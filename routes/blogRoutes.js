const express = require('express');
const {createBlog} = require('../controllers/blogController');
const {checkRole} = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const blogRoute = express.Router();

//POST: Create a blog (Only Bloggers and Admins)
blogRoute.post("/", checkRole("blogger"), upload.single("image"), createBlog);

module.exports = blogRoute;