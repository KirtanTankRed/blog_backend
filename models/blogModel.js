const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    image: {type: String, required: false},
    author: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}, //ref: "User" is refernce to User Model
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}] //Array of User IDs who liked the blog
},
{timestamps: true},
);

//Virtual field to get like count
blogSchema.virtual("likecount").get(function(){
    return this.likes.length;
});

const blogModel = mongoose.model("Blog", blogSchema);
module.exports = blogModel;