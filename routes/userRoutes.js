const express =  require('express');
const {signupUser, loginUser, logoutUser, updateUser} = require('../controllers/userController');

const userRoute = express.Router();

//POST: /signup
userRoute.post("/", signupUser);

//POST: /login
userRoute.post("/login", loginUser);

//GET: /logout
userRoute.post("/logout", logoutUser);

//PUT: Update user info (admin only)
userRoute.put('/:id', updateUser);
    

module.exports =  userRoute;
