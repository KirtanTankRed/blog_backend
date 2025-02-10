const Blog = require("../models/blogModel");

//Craete a new blog (access - blogger, admin only)
async function createBlog(req, res) {
  try {
      const { title, description } = req.body;
      const imageUrl = req.file ? req.file.path : undefined; // Extract file path only if uploaded

      if (!title || !description) {
          return res.status(400).json({ message: "Title and description are required" });
      }

      const user = req.session.user;
      if (!user) {
          return res.status(401).json({ message: "Unauthorized" });
      }

      const newBlog = new Blog({
          title,
          description,
          image: imageUrl, // Store image path if provided
          author: user.id
      });

      await newBlog.save();
      res.status(201).json({ message: "Blog created successfully", blog: newBlog });
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

//Update a blog by ID
async function updateBlog(request, response) {
  try{
    const{id} = request.params;
    const{title, description} = request.body;
    const imageUrl = request.file?request.file.path: undefined; //only update if new image is provided

    //Find blog
    const blog = await Blog.findById(id);

    if(!blog){
      return response.status(404).json({message: "Blog not found"});
    }

    //Get logged in user details
    const user = request.session.user;

    //Ensure user is either the blog's author (blogger or admin) or an admin

    if (user.id !== blog.author.toString() && user.role !== "admin"){
      return response.status(403).json({message: "Access denied, Only the author or admin can make the changes"})
    }

    //Update the provided fields
    if (title) blog.title = title;
    if (description) blog.description = description;
    if (imageUrl) blog.image= imageUrl;

    const updatedBlog = await blog.save();  

    response.status(200).json({message: "Blog updated succesfullly", blog: updatedBlog
    });

  }catch(error)
  {
    response.status(500).json({message: error.message});
  }
} 

module.exports = { createBlog, getallBlogs, getBlogbyID, updateBlog };
