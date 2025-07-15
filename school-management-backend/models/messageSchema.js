import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'senderModel',
        required: true
    },
    senderModel: {
        type: String,
        required: true,
        enum: ['Admin', 'Teacher', 'Student', 'Parent']
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'receiverModel',
        required: true
    },
    receiverModel: {
        type: String,
        required: true,
        enum: ['Admin', 'Teacher', 'Student', 'Parent']
    },
    content: {
        type: String,
        required: true
    },
    conversationId: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export default mongoose.model('message', messageSchema); 