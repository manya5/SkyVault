const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    file: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File'
    },
    fileDeletedAt: {
        type: Date
    },
    fileDownloadedAt: {
        type: Date
    },
    fileUploadedAt: {
        type: Date
    },
    filename: {
        type: String
    },
    filesize: {
        type: String
    },
    fileExtension: {
        type: String
    },
    activityType: {
        type: String,
        enum: ['upload', 'download', 'delete']
    }
});

module.exports = mongoose.model('Activity', activitySchema);