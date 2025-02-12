const Blog = require("../models/blogModel");

//Craete a new blog (access - blogger, admin only)
async function createBlog(req, res) {
  try {
    const { title, description } = req.body;
    const imageUrl = req.file ? req.file.path : undefined; // Extract file path only if uploaded

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    const user = req.session.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const newBlog = new Blog({
      title,
      description,
      image: imageUrl, // Store image path if provided
      author: user.id,
    });

    await newBlog.save();
    res
      .status(201)
      .json({ message: "Blog created successfully", blog: newBlog });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
      .populate("likes", "name") //Fetch names of those who liked
      .sort({ createdAt: -1 }) // Sort newest first
      .skip(skip)
      .limit(limit);

    // Total count of blogs
    const totalBlogs = await Blog.countDocuments();

    //Format response to include all details
    const formattedBlogs = blogs.map((blog) => ({
      _id: blog._id,
      title: blog.title,
      description: blog.description,
      image: blog.image,
      author: blog.author,
      createdAt: blog.createdAt,
      likeCount: blog.likes.length, //Total number of likes
      likedBy: blog.likes.map((user) => ({ _id: user._id, name: user.name })), //Fetch names
    }));

    response.status(200).json({
      message: "Blogs fetched successfully",
      page,
      totalPages: Math.ceil(totalBlogs / limit),
      formattedBlogs,
    });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
}

//Get a single blog by ID
async function getBlogbyID(request, response) {
  try {
    console.log("Inside getBlogbyID function");
    const { id } = request.params;
    // console.log("Received ID:", request.params.id); // DEBUGGING

    // Fetch blog by ID with author and likes populated
    const blog = await Blog.findById(id)
      .populate("author", "name email role") // Fetch author details
      .populate("likes", "name"); // Fetch names of users who liked the blog

    if (!blog) {
      //if no blog found
      return response.status(404).json({ message: "Blog not found" });
    }

    // Format response
    const formattedBlog = {
      _id: blog._id,
      title: blog.title,
      description: blog.description,
      image: blog.image,
      author: blog.author,
      createdAt: blog.createdAt,
      likeCount: blog.likes.length, // Total likes
      likedBy: blog.likes.map((user) => ({ _id: user._id, name: user.name })), // Names of users who liked
    };

    //Send the fetched Blog
    response
      .status(200)
      .json({ message: "Blog fetched succesfullly", formattedBlog });
  } catch (error) {
    response.status(200).json({ message: ` Error: ${error.message}` });
  }
}

//Update a blog by ID
async function updateBlog(request, response) {
  try {
    const { id } = request.params;
    const { title, description } = request.body;
    const imageUrl = request.file ? request.file.path : undefined; //only update if new image is provided

    //Find blog
    const blog = await Blog.findById(id);

    if (!blog) {
      return response.status(404).json({ message: "Blog not found" });
    }

    //Get logged in user details
    const user = request.session.user;

    //Ensure user is either the blog's author (blogger or admin) or an admin

    if (user.id !== blog.author.toString() && user.role !== "admin") {
      return response.status(403).json({
        message: "Access denied, Only the author or admin can make the changes",
      });
    }

    //Update the provided fields
    if (title) blog.title = title;
    if (description) blog.description = description;
    if (imageUrl) blog.image = imageUrl;

    const updatedBlog = await blog.save();

    response
      .status(200)
      .json({ message: "Blog updated succesfullly", blog: updatedBlog });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
}

async function deleteBlog(request, response) {
  try {
    const { id } = request.params;
    const user = request.session.user;

    if (!user) {
      return response
        .status(401)
        .json({ message: "Unauthorized. Please log in." });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return response.status(404).json({ message: "Blog not found" });
    }

    console.log("User ID:", user.id);
    console.log("Blog Author:", blog.author.toString());

    const isAuthor = user.id.toString() === blog.author.toString();
    const isAdmin = user.role === "admin";

    if (isAuthor || isAdmin) {
      await blog.deleteOne();
      return response
        .status(200)
        .json({ message: "Blog deleted successfully!" });
    }

    return response.status(403).json({
      message:
        "Access denied. Only the author or an admin can delete this blog.",
    });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
}

//Like or unlike a blog
async function likeBlog(request, response) {
  try {
    const { id } = request.params; //Get Blog id
    const userId = request.session.user.id; //Get the logged-in User's ID

    //Find the blog
    const blog = await Blog.findById(id); //get the blog by id from database
    if (!blog) {
      //No blog case
      return response.status(404).json({ message: "Blog not found!" });
    }

    const hasLiked = blog.likes.includes(userId); //Liked or not

    if (hasLiked) {
      //liked already cased
      //If user had liked already, Unlike it (Remove user id from array)
      blog.likes = blog.likes.filter((like) => like.toString() !== userId);
    } else {
      //Like: Add user ID to like array
      blog.likes.push(userId);
    }

    await blog.save();

    response.status(200).json({
      message: hasLiked
        ? "Blog unliked succesfullly!"
        : "Blog liked succesfullly!",
      likeCount: blog.likes.length,
      likedBy: blog.likes,
    });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
}

module.exports = {
  createBlog,
  getallBlogs,
  getBlogbyID,
  updateBlog,
  deleteBlog,
  likeBlog,
};
