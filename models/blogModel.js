const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    image: {type: String, required: false},
    author: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}, //ref: "User" is refernce to User Model
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}], //Array of User IDs who liked the blog
    comments:[{text: {type: String, required: true}, commenter: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}, createdAt: {type: Date, default: Date.now, immutable: true}}],
},
{timestamps: true},
);

//Virtual field to get like count
blogSchema.virtual("likecount").get(function(){
    return this.likes.length;
});

//Virtual field to get comment count
blogSchema.virtual("commentcount").get(function(){
    return this.comments.length;
});

const blogModel = mongoose.model("Blog", blogSchema);
module.exports = blogModel;