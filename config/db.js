const mongoose = require("mongoose");


// let userInfoDB, blogDB;
let userInfoDB;
async function connectUserInfoDB() {
  if (!userInfoDB) {
    try {
      // userInfoDB = await mongoose.createConnection(process.env.MONGO_URI_USER_INFO);
      userInfoDB = await mongoose.connect(process.env.MONGO_URI_USER_INFO);
      console.log(`Database connected`);
    } catch (error) {
      console.error(`Error connecting to User Info DB: ${error.message}`);
      process.exit(1);
    }
  }
  return userInfoDB;
}


module.exports = connectUserInfoDB;