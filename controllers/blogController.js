const Blog = require("../models/blogModel");

//Craete a new blog (access - blogger, admin only)
async function createBlog(request, response) {
  const { title, description } = request.body;

  if (!title || !description) {
    return response
      .status(400)
      .json({ message: "Title and description cannot be empty!" });
  }

  const imageUrl = request.file ? request.file.path : "uploads/default.jpg"; // Use fallback if no image provided

  try {
    const newBlog = new Blog({
      title: title,
      image: imageUrl,
      description: description,
      author: request.session.user.id, //store logged-in user as author
    });

    const savedBlog = await newBlog.save();
    response
      .status(201)
      .json({ message: "Blog created successfully!", blog: savedBlog });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
}

// Get paginated blogs with author details
async function getallBlogs(request, response) {
  try {
    // console.log("Inside getallBlogs function"); //DEBUGGING
    // Pagination setup
    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Fetch blogs with author details, pagination, and sorting
    const blogs = await Blog.find()
      .populate("author", "name email role") // Include author details
      .sort({ createdAt: -1 }) // Sort newest first
      .skip(skip)
      .limit(limit);

    // Total count of blogs
    const totalBlogs = await Blog.countDocuments();

    response.status(200).json({
      message: "Blogs fetched successfully",
      page,
      totalPages: Math.ceil(totalBlogs / limit),
      blogs,
    });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
}

//Get Blog by id
//Get a single blog by ID
async function getBlogbyID(request, response) {
  try {
    console.log("Inside getBlogbyID function");
    const { id } = request.params;
    console.log("Received ID:", request.params.id); // Add this

    //Fetch blog by ID and populate author details
    // const blog = await Blog.findById(id).populate("author", "name email role");
    const blog = await Blog.findById(id);
    if (!blog) {
      return response.status(404).json({ message: "Blog not found" });
    }

    //Send the fetched Blog
    response.status(200).json({ message: "Blog fetched succesfullly", blog });
  } catch (error) {
    response.status(200).json({ message: ` Error: ${error.message}` });
  }
}

module.exports = { createBlog, getallBlogs, getBlogbyID };
