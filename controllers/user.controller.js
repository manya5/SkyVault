const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');
let fileModel = require('../models/file.model');
const profileModel = require('../models/profile.model');

const registerUser = async (req, res) => {
    try {
        // fetch user register data from req body
        const {fullname, username, email, phone, password} = req.body;

        // check if user already exists
        let user = await User.findOne({email});

        // if user already exists, return error 
        if(user) return res.status(500).send("User already exists!");

        // if user does not exist, create user
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {
                let user = await User.create({
                    fullname,
                    username,
                    email,
                    phone,
                    password: hash
                });

                // create profile for user
                await profileModel.create({
                    user: user._id,
                    profilepic: "default.png",
                    profilename: fullname,
                    profileemail: email
                });

                // generate token for user
                let token = jwt.sign({email, userid: user._id}, "shhhh");
                res.cookie('token', token);
                res.redirect('/skyvault/login');
            })
        });
    }
    catch(err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: err.message,
            message: 'User registration failed!'
        })
    }


}

const loginUser = async (req, res) => {
    let {email, password} = req.body;

    let user = await User.findOne({email});

    if(!user) return res.status(500).send("Something went wrong!");

    bcrypt.compare(password, user.password, (err, result) => {
        if(result) {
            let token = jwt.sign({email, userid: user._id}, "shhhh");
            res.cookie('token', token);
            res.status(200).redirect('/skyvault/home');
        }
        else res.redirect('/skyvault/login');
    })
};




const logoutUser = async (req, res) => {
    res.cookie('token', "");
    res.redirect('/skyvault/login');
};


async function isLoggedIn(req, res, next) {
    if(req.cookies.token === "") res.redirect('/skyvault/login');
    else {
        let data = jwt.verify(req.cookies.token, "shhhh");
        req.user = data;
        let files = await fileModel.find({user: req.user._id});
        // console.log(req.user);
        next();
    }
}

module.exports = {
    registerUser,
    isLoggedIn,
    loginUser,
    logoutUser
}
