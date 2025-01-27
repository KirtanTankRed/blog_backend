//server.js
const express = require('express');
require('dotenv').config();
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config(); //Load envrionment variables
connectDB(); //connect to MongoDB database

const app = express();

//Middleware to handle json (built in with express)
app.use(express.json()) // Returns middleware that only parses json

//Port from envrionment variables or default to 5000
const PORT = process.env.PORT || 5000;

//Test route
app.get('/', (request,response) => {
    response.send("Server is running!")
});

//Start the server
app.listen(PORT, ()=>{
    console.log(`Server is running on port: http://localhost: ${PORT}`)
})