import Message from '../models/messageSchema.js';

// Send a message
const sendMessage = async (req, res) => {
    try {
        const { sender, senderModel, receiver, receiverModel, content, conversationId } = req.body;
        const message = new Message({ sender, senderModel, receiver, receiverModel, content, conversationId });
        await message.save();
        res.status(201).json(message);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get inbox or sent messages for a user
const getMessages = async (req, res) => {
    try {
        const { userId, userModel, box } = req.query; // box: 'inbox' or 'sent'
        let filter = {};
        if (box === 'sent') {
            filter.sender = userId;
            filter.senderModel = userModel;
        } else {
            filter.receiver = userId;
            filter.receiverModel = userModel;
        }
        const messages = await Message.find(filter)
            .sort({ timestamp: -1 })
            .populate('sender', 'name email')
            .populate('receiver', 'name email');
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all messages in a conversation
const getConversation = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const messages = await Message.find({ conversationId })
            .sort({ timestamp: 1 })
            .populate('sender', 'name email')
            .populate('receiver', 'name email');
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Mark a message as read
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await Message.findByIdAndUpdate(id, { read: true }, { new: true });
        res.json(message);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export { sendMessage, getMessages, getConversation, markAsRead }; 
