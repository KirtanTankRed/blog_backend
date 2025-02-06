const bcrypt = require('bcryptjs');
const {userModel} = require('../models/userModel');

//User signup
async function signupUser(request, response) {
    const { name, email, password, role } = request.body;

    // console.log("Inside signupUser"); //DEBUGGING
    //Check if user already exists
    
    const userExists = await userModel.findOne({ email });
    console.log("User exists ", userExists);
    
    if (userExists) {
        return response.status(400).json({ message: "User already exists!" });
    }

    //Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Create new user
    const user = new userModel({
        name,
        email,
        password: hashedPassword,
        role: role || 'reader' //Default role will be reader
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
    const user = await userModel.findOne({ email });
    if (!user) {
        return response.status(404).json({ message: "User not found" });
    }

    //compare password with stored hashed password

    // console.log("Stored password", user.password); //DEBUGGING
    // console.log("Input password", password); //DEBUGGING
    const isMatch = await bcrypt.compare(password, user.password);
    

    if (!isMatch) {
        return response.status(200).json({ message: "Invalid credentials" });
    }

    //user login
    request.session.user = { id: user._id, name: user.name, email: user.email, role: user.role  }; //save user info to session
    response.status(200).json({ message: `Log in successful ${user.name}`, user: request.session.user });
};

// User Logout with Session
function logoutUser(request, response) {

    request.session.destroy((error) => {
        if (error) {
            return response.status(500).json({ message: "Failed to log out" });
        }
        response.status(200).json({ message: `Logged out successfully` });
    });
};

module.exports = { signupUser, loginUser, logoutUser };