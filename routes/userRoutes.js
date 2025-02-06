const express =  require('express');
const {signupUser, loginUser, logoutUser} = require('../controllers/userController');
const userRoute = express.Router();

//POST: /signup
userRoute.post("/id", signupUser);

//POST: /login
userRoute.post("/login", loginUser);

//GET: /logout
userRoute.post("/logout", logoutUser);

module.exports =  userRoute;
