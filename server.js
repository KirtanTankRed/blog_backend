// //server.js
// const express = require('express');
// require('dotenv').config();
// const dotenv = require('dotenv');
// const { connectUserInfoDB, connectBlogDB } = require('./config/db');
// const session = require("express-session");
// const userRoutes =  require('./routes/userRoutes');



// dotenv.config(); //Load envrionment variables

// // await connectUserInfoDB(); //Connect to User info MongoDB database
// // await connectBlogDB(); //Connect to Blog MongoDB database

// (async () => {
//   await connectUserInfoDB(); // Connect User Info DB
//   await connectBlogDB(); // Connect Blog DB
// })();

// const app = express();

// //Middleware to handle json (built in with express)
// app.use(express.json()) // Returns middleware that only parses json

// //routes
// app.use('/api/users', userRoutes); //Prefix the routes with '/api/users'


// //session 
// app.use(
//     session({
//         secret: process.env.SECRET_KEY,
//         resave: false,
//         saveUninitialized: true,
//         cookie: {maxAge: 3600000}, //Session lasts 1 hour
//     })
// );



// //Port from envrionment variables or default to 5000
// const PORT = process.env.PORT || 5000;

// //Test route
// app.get('/', (request,response) => {
//     response.send("Server is running!")
// }); 

// //Start the server
// app.listen(PORT, ()=>{
//     console.log(`Server is running on port: http://localhost: ${PORT}`)
// })

const express = require('express');
require('dotenv').config(); // ✅ Load environment variables
const session = require("express-session");
// const { connectUserInfoDB, connectBlogDB } = require('./config/db');
const connectUserInfoDB = require('./config/db');
const userRoute = require('./routes/userRoutes');


const app = express(); // ✅ Initialize Express

// ✅ Middleware (should come before routes)
app.use(express.json()); // Parse JSON request body

app.use(
    session({
        secret: process.env.SECRET_KEY,
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 3600000 },
    })
);

// ✅ Routes
app.use('/api/users', userRoute); // Prefix routes with '/api/users'

// ✅ Test route
app.get('/', (req, res) => {
    res.send("Server is running!");
});

// ✅ Start server only after database connections
async function startServer() {
    try {
        await connectUserInfoDB(); // Connect User Info DB
        // await connectBlogDB(); // Connect Blog DB

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Failed to connect to databases:", error);
        process.exit(1); // Exit process if DB connection fails
    }
}

startServer();
