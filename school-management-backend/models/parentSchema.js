import mongoose from 'mongoose';

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
    role: {
        type: String,
        default: 'Parent'
    },
    children: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }],
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    }
}, { timestamps: true });

export default mongoose.model('parent', parentSchema); 