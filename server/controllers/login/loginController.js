const mongoose = require('mongoose');
const dotenv = require('dotenv');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Models
const patientModel = require('../../models/Patient');
const doctorModel = require('../../models/Doctor');
const adminModel = require('../../models/Admin');
const refreshtokenModel = require('../../models/RefreshToken');

const loginUser = asyncHandler(async (req, res) => {
    const userLoggingIn = req.body;

    // Check if username and password are provided
    if (!userLoggingIn.username) {
       return res.status(400).json({ message: 'Please add a username!', loggingIn: false});
    }
    if (!userLoggingIn.password) {
       return res.status(400).json({ message: 'Please add a password!', loggingIn: false});
    }

    // Check if user exists
    let userLoggedIn = null;
    let userType = "";
    let patientLoggedIn = await patientModel.findOne({username: userLoggingIn.username});
    let doctorLoggedIn = await doctorModel.findOne({username: userLoggingIn.username});
    let adminLoggedIn = await adminModel.findOne({username: userLoggingIn.username});

    if (patientLoggedIn === null && doctorLoggedIn === null && adminLoggedIn === null) {
        return res.status(400).json({ message: "Invalid Username or Password", loggingIn: false});
    }

    if (patientLoggedIn != null) {
        userLoggedIn = patientLoggedIn;
        userType = "patient";
    } else if (doctorLoggedIn != null) {
        userLoggedIn = doctorLoggedIn;
        userType = "doctor";
    } else {
        userLoggedIn = adminLoggedIn;
        userType = "admin";
    }

    // Check if password is correct
    const passwordCorrect = await bcrypt.compare(userLoggingIn.password, userLoggedIn.password);
    if (passwordCorrect) {
        const payload = {
            username: userLoggingIn.username,
        }
        
        // Create Access Token
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);

        if (!accessToken) {
            return res.status(403).json({ message: "Invalid Username or password", loggingIn: false });
        }
        
        // Create Refresh Token
        const refreshToken = jwt.sign(payload,  process.env.REFRESH_TOKEN_SECRET);
        refreshtokenModel.create({token: refreshToken});

        // Send Access Token and Refresh Token
        return res.status(200).json({ message: "Success", accessToken: "Bearer " + accessToken, refreshToken: refreshToken, userType: userType, loggingIn: true, name: userLoggedIn.name});

    } else {
        return res.status(401).json({
            message: "Invalid Username or password", loggedIn: false
        });
    }
});

module.exports = {loginUser};