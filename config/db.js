const mongoose = require("mongoose");

// async function connectUserInfoDB() {
//   try {
//     const connection = await mongoose.createConnection(process.env.MONGO_URI_USER_INFO);
//     console.log(`MongoDB connected: ${connection.connection.host}`);
//     return mongoose; // Return mongoose instance for defining models
//   } catch (error) {
//     console.error(`Error: ${error.message}`);
//     process.exit(1); //Exit process
//   }
// }

// async function connectBlogDB() {
//   try {
//     const connection = await mongoose.createConnection(process.env.MONGO_URI_BLOG);
//     console.log(`MongoDB connected: ${connection.connection.host}`);
//     return mongoose; // Return mongoose instance for defining models
//   } catch (error) {
//     console.error(`Error: ${error.message}`);
//     process.exit(1); //Exit process
//   }
// }

// module.exports = { connectUserInfoDB, connectBlogDB };


// let userInfoDB, blogDB;
let userInfoDB;
async function connectUserInfoDB() {
  if (!userInfoDB) {
    try {
      // userInfoDB = await mongoose.createConnection(process.env.MONGO_URI_USER_INFO);
      userInfoDB = await mongoose.connect(process.env.MONGO_URI_USER_INFO);
      console.log(`User Info DB connected`);
    } catch (error) {
      console.error(`Error connecting to User Info DB: ${error.message}`);
      process.exit(1);
    }
  }
  return userInfoDB;
}

// async function connectBlogDB() {
//   if (!blogDB) {
//     try {
//       blogDB = await mongoose.createConnection(process.env.MONGO_URI_BLOG);
//       console.log(`Blog DB connected`);
//     } catch (error) {
//       console.error(`Error connecting to Blog DB: ${error.message}`);
//       process.exit(1);
//     }
//   }
//   return blogDB;
// }

// module.exports = { connectUserInfoDB, connectBlogDB };
module.exports = connectUserInfoDB;