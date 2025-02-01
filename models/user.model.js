const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        minLength: 3,
    },
    username: {
        type: String,
        required: true,
        minLength: 3,
    },
    phone: {
        type: Number,
        required: true,
        minLength: 10,
        maxLength: 10,
    },
    email: {
        type: String,
        required: true,
        minLength: 13,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
    },
    loggedInAt: {
        type: Date,
        default: Date.now
    },
    loggedOutAt: {
        type: Date
    },
    
    files: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File'
    }],
    
    activities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity'
    }]
});

module.exports = mongoose.model('User', userSchema);