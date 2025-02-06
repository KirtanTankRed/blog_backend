// middleware/sessionMiddleware.js
const session = require('express-session');

require('dotenv').config(); // ✅ Load environment variables

// Middleware to handle session initialization
const sessionMiddleware = (app) => {
    app.use(
        session({
            secret: process.env.SECRET_KEY,
            resave: false,
            saveUninitialized: true,
            cookie: { maxAge: 3600000 }, // Set session cookie expiration time
        })
    );
};

module.exports = sessionMiddleware;