const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    profilename: {
        type: String,
        required: true
    },
    profileemail: {
        type: String,
        required: true
    },
    profilepic: {
        type: String,
    }
});

module.exports = mongoose.model('Profile', profileSchema);