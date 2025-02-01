const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const fileModel = require('../models/file.model');
const userModel = require('../models/user.model');
const activityModel = require('../models/activity.model');
const {isLoggedIn} = require('../controllers/user.controller');
const express = require('express');
const fs = require('fs');

// express app
const app = express();
app.use(express.json());

// multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/files/uploads')
    },
    // generate unique filename
    filename: function (req, file, cb) {
        crypto.randomBytes(12, function (err, bytes) {
            const fn = bytes.toString('hex') + path.extname(file.originalname)
            cb(null, fn)
        })    
    }
})
const uploadvar = multer({ storage: storage })

// upload file handler
const uploadFile = async (req, res) => {
    console.log(req.user);
    const file = new fileModel({
        user: req.user['userid'],
        filename: req.file.originalname,
        filetype: req.file.mimetype,
        filesize: req.file.size,
        fileExtension: path.extname(req.file.originalname),
        uploadedfilename: req.file.filename
    });
    await file.save();  

    
    
    // update activity
    const activity = new activityModel({
        user: req.user['userid'],
        file: file._id,
        activityType: 'upload',
        filename: file.filename,
        filesize: (file.filesize / 1000).toFixed(2) + " KB",
        fileExtension: file.fileExtension,
        fileDownloadedAt: null,
        fileUploadedAt: Date.now(),
        fileDeletedAt: null
    });
    await activity.save();
    
    // update user files
    const updatedUser = await userModel.findByIdAndUpdate(req.user['userid'], { $push: { files: file._id, activities: activity._id } }, { new: true })
    .populate('files').populate('activities').exec();

    const updatedFile = await fileModel.findByIdAndUpdate(file._id, { $push: { activity: activity._id } }, { new: true })
    .populate('activity').exec();
    
    res.status(200).redirect('/skyvault/uploadfiles');
}


// download file handler
const downloadFile = async (req, res) => {
    // fetch file from database
    const file = await fileModel.findById(req.query.id);

    

    // update activity
    const activity = new activityModel({
        user: req.user['userid'],
        activityType: 'download',
        filename: file.filename,
        filesize: (file.filesize / 1000).toFixed(2) + " KB",
        fileExtension: file.fileExtension,
        fileDownloadedAt: Date.now(),
        fileUploadedAt: null,
        fileDeletedAt: null
    });
    await activity.save();

    const updatedUser = await userModel.findByIdAndUpdate(req.user['userid'], { $push: { activities: activity._id } }, { new: true })
    .populate('activities').exec();

    const updatedFile = await fileModel.findByIdAndUpdate(file._id, { $push: { activity: activity._id } }, { new: true })
    .populate('activity').exec();

    // download file
    res.download(path.join(__dirname, '../public/files/uploads/' + file.uploadedfilename), file.filename);
}




// delete file handler
const deleteFile = async (req, res) => {
    try {
        const {id} = req.query;
    
        // delete file from database
        const file = await fileModel.findByIdAndDelete(id);
        
        
        


        // delete file from server
        fs.unlinkSync(path.join(__dirname, '../public/files/uploads/' + file.uploadedfilename));

        // res.status(200).json({
        //     status: 'success',
        //     message: "File deleted successfully",
        //     user: updatedUser
        // })

        // update activity
        const activity = new activityModel({
            user: req.user['userid'],
            activityType: 'delete',
            filename: file.filename,
            filesize: (file.filesize / 1000).toFixed(2) + " KB",
            fileExtension: file.fileExtension,
            fileDownloadedAt: null,
            fileUploadedAt: null,
            fileDeletedAt: Date.now()
        });
        await activity.save();

        const updatedUser = await userModel.findByIdAndUpdate(req.user['userid'], { $pull: { files: file._id}, $push: { activities: activity._id } }, { new: true })
        .populate('files').populate('activities').exec();

        const updatedFile = await fileModel.findByIdAndUpdate(file._id, { $push: { activity: activity._id } }, { new: true })
        .populate('activity').exec();

        res.status(200).redirect('/skyvault/allfiles');
    }

    catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: 'Error deleting file'
        });
    }
}


// export controllers
module.exports = {
    uploadFile,
    uploadvar,
    downloadFile,
    deleteFile
}
