//  
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'blogger', 'reader'], default: 'reader', required: true },
},
{timestamps: true} //automatically includes timestamps
);

const userModel = mongoose.model("User", userSchema);
module.exports= userModel;