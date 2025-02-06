const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    image: {type: String, required: false},
    author: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}, //ref: "User" is refernce to User Model
},
{timestamps: true},
);

const blogModel = mongoose.model("Blog", blogSchema);
module.exports = blogModel;