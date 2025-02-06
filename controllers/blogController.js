const Blog = require('../models/blogModel');

//Craete a new blog (access - blogger, admin only)
async function createBlog(request, response){
    const{title, description} = request.body;

    if (!title || !description) {
        return response.status(400).json({message: "Title and description cannot be empty!" });
    }

    const imageUrl = request.file ? request.file.path : "uploads/default.jpg"; // Use fallback if no image provided

    try{
        const newBlog = new Blog({
            title: title,
            image: imageUrl,
            description: description,
            author: request.session.user.id //store logged-in user as author
        });

        const savedBlog = await newBlog.save();
        response.status(201).json({message: "Blog created successfully!", blog: savedBlog});
    }catch(error) {
        response.status(500).json({message: error.message});
    }
}

async function getAllBlogs(request, response) {
    try{
        const blogs = await Blog.find().populate('author', 'name email role'); //Fetch author details
        response.status(200).json({blogs});
    }catch(error){
        response.status(500).json({message: error.message});
    }
}

module.exports ={createBlog, getAllBlogs};