const mongoose = require('mongoose');
const {connectBlogDB} = require('../config/db');

const blogSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    image: {type: String, required: false},
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}, //ref: "User" is refernce to User Model
},
{timestamps: true},
);

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
