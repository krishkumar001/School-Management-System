import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
    subName: {
        type: String,
        required: true
    },
    subCode: {
        type: String,
        required: true
    },
    sessions: {
        type: String,
        required: true
    },
    sclassName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sclass',
        required: true
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher'
    }
}, { timestamps: true });

export default mongoose.model('Subject', subjectSchema);