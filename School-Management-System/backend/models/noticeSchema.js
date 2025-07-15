import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    }
}, { timestamps: true });

export default mongoose.model('Notice', noticeSchema);