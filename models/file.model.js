const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    filename: {
        type: String, 
        required: true
    },
    uploadedfilename: {
        type: String,
        // required: true
    },
    uploadtime: {
        type: Date,
        required: true,
        default: Date.now
    },
    filetype: {
        type: String,
        required: true
    },
    fileExtension: {
        type: String,
        required: true
    },
    filesize: {
        type: Number,
        required: true
    },
    activity: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity'
    }]
}) 
module.exports = mongoose.model('File', fileSchema);