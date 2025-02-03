const bcrypt = require('bcryptjs');
// const User = require('../models/userModel');
const {userModel} = require('../models/userModel');

//User signup
async function signupUser(request, response) {
    const { name, email, password } = request.body;

    console.log("Inside signupUser");
    //Check if user already exists
    // const userExists = await User.findOne({ email });
    const userExists = await userModel.findOne({ email });
    console.log("User exists ", userExists);
    
    if (userExists) {
        return response.status(400).json({ message: "User already exists!" });
    }

    //Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Create new user
    const user = new User({
        name,
        email,
        password: hashedPassword
    });

    try {
        await user.save();
        response.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }

}

//user login with session
async function loginUser(request, response) {
    const { email, password } = request.body;

    //Find user by email
    const user = await User.findOne({ email });
    if (!user) {
        return response.status(404).json({ message: "User not found" });
    }

    //compare password with stored hashed password
    const isMatch = await bcrypt.compare(password, hashedPassword);

    if (!isMatch) {
        return response.status(200).json({ message: "Invalid credentials" });
    }

    //user login
    request.session.user = { id: user._id, email: user.email }; //save user info to session
    response.status(200).json({ message: "Log in successful", user: request.session.user });
};

// User Logout with Session
function logoutUser(request, response) {
    request.session.destroy((error) => {
        if (error) {
            return response.status(500).json({ message: "Failed to log out" });
        }
        response.status(200).json({ message: "Logged out successfully" });
    });
};

module.exports = { signupUser, loginUser, logoutUser };