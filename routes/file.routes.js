const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../controllers/user.controller');
const {uploadFile, uploadvar, downloadFile, deleteFile} = require('../controllers/file.controller');

router.post('/upload', isLoggedIn, uploadvar.single('file'), uploadFile);

router.get('/download-file', isLoggedIn, downloadFile);
router.get('/delete-file', isLoggedIn, deleteFile);

module.exports = router;