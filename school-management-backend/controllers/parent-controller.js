import Parent from '../models/parentSchema.js';
import Student from '../models/studentSchema.js';
import Notice from '../models/noticeSchema.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const parentRegister = async (req, res) => {
    try {
        const { name, email, password, children, school } = req.body;
        const existing = await Parent.findOne({ email });
        if (existing) return res.status(400).json({ message: 'Parent already exists' });
        const hashedPassword = await bcrypt.hash(password, 10);
        const parent = new Parent({ name, email, password: hashedPassword, children, school });
        await parent.save();
        res.status(201).json({ message: 'Parent registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const parentLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const parent = await Parent.findOne({ email });
        if (!parent) return res.status(400).json({ message: 'Parent not found' });
        const isMatch = await bcrypt.compare(password, parent.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
        const token = jwt.sign({ id: parent._id, role: 'Parent' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
        res.json({ token, parent });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getParentChildren = async (req, res) => {
    try {
        const parent = await Parent.findById(req.params.id).populate({
            path: 'children',
            populate: [
                { path: 'sclassName', select: 'sclassName' },
                { path: 'examResult.subName', select: 'subName' },
                { path: 'attendance.subName', select: 'subName' }
            ]
        });
        if (!parent) return res.status(404).json({ message: 'Parent not found' });
        res.json(parent.children);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getParentNotices = async (req, res) => {
    try {
        // Notices for the parent's school
        const parent = await Parent.findById(req.params.id);
        if (!parent) return res.status(404).json({ message: 'Parent not found' });
        const notices = await Notice.find({ school: parent.school });
        res.json(notices);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateParent = async (req, res) => {
    try {
        let result = await Parent.findByIdAndUpdate(req.params.id,
            { $set: req.body },
            { new: true });
        result.password = undefined;
        res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
}

export { parentRegister, parentLogin, getParentChildren, getParentNotices, updateParent }; 
