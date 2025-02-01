const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const fileModel = require('../models/file.model');

const {registerUser, loginUser, logoutUser, isLoggedIn} = require('../controllers/user.controller');

// async function getFiles() {
//     let files = await fileModel.find({user: req.user._id});
//     return files;
// }


router.get('/login', (req, res) => {
    res.render('login');
});
router.get('/register', (req, res) => {
    res.render('register');
});    
router.get('/home', isLoggedIn, (req, res) => {
    res.render('home');
});
router.get('/uploadfiles', isLoggedIn, (req, res) => {
    res.render('uploadfiles');
});
router.get('/allfiles', isLoggedIn, async (req, res) => {
    let files = await fileModel.find({user: req.user['userid']});
    // console.log(files[0].filesize);
    res.render('allfiles', {files});
});

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);



module.exports = router;