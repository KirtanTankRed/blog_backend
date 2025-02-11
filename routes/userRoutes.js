const express =  require('express');
const {signupUser, loginUser, logoutUser, updateUser, getAllUsers} = require('../controllers/userController');
const checkRole = require('../middleware/authMiddleware');
const userRoute = express.Router();

//POST: /signup
userRoute.post("/", signupUser);

//POST: /login
userRoute.post("/login", loginUser);

//GET: /logout
userRoute.post("/logout", logoutUser);

//PUT: Update user info (admin only)
userRoute.put('/:id', checkRole("admin"), updateUser);
    
//GET: Get info of all users
userRoute.get('/', checkRole("admin"), getAllUsers);

module.exports =  userRoute;
