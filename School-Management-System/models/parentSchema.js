const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    children: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student',
        required: true
    }],
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true
    },
    role: {
        type: String,
        default: 'Parent'
    },
    avatar: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('parent', parentSchema); 