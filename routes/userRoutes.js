const express =  require('express');
const {signupUser, loginUser, logoutUser, updateUser, getAllUsers, getUserbyId} = require('../controllers/userController');
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

//GET: Get user information by user id
userRoute.get('/:id', checkRole("admin"), getUserbyId);

module.exports =  userRoute;