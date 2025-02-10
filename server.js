const express = require('express');
require('dotenv').config(); // ✅ Load environment variables
// const session = require("express-session");
// const { connectUserInfoDB, connectBlogDB } = require('./config/db');
const connectUserInfoDB = require('./config/db');
const userRoute = require('./routes/userRoutes');
const blogRoute = require('./routes/blogRoutes');
const {checkRole} = require('./middleware/authMiddleware');
const sessionMiddleware =  require('./middleware/sessionMiddleware'); //import sessionMiddleware

const app = express(); // ✅ Initialize Express

// ✅ Middleware (should come before routes)
app.use(express.json()); // Parse JSON request body
app.use(express.urlencoded({ extended: true }));

// // Role based access
// app.use(checkRole);

sessionMiddleware(app);

// ✅ User Routes
app.use('/api/users', userRoute); // Prefix routes with '/api/users'

//✅ Blog Routes
app.use('/api/blogs', blogRoute);  // Prefix routes with '/api/blogs'

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
module.exports = {checkRole};