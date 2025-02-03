const {connectUserInfoDB} = require('../config/db');
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
},
{timestamps: true} //automatically includes timestamps
);

const User = mongoose.model("User", userSchema);
// module.exports = User;
exports.userModel=User;