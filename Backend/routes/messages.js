import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

// @desc    Submit a new message/feedback
// @route   POST /api/messages
// @access  Public
router.post('/', async (req, res) => {
    const { userId, firstName, lastName, email, phone, subject, message } = req.body;

    try {
        const newMessage = await Message.create({
            user: userId || null,
            firstName,
            lastName,
            email,
            phone,
            subject,
            message
        });

        res.status(201).json({ message: 'Message sent successfully', success: true, data: newMessage });
    } catch (error) {
        console.error('Submit Message Error:', error);
        res.status(500).json({ message: 'Error sending message', success: false });
    }
});

// @desc    Get all messages (Admin)
// @route   GET /api/messages
// @access  Admin
router.get('/', async (req, res) => {
    try {
        const messages = await Message.find({}).populate('user', 'name email mobile').sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        console.error('Get Messages Error:', error);
        res.status(500).json({ message: 'Error fetching messages' });
    }
});

// @desc    Update message status
// @route   PATCH /api/messages/:id/status
// @access  Admin
router.patch('/:id/status', async (req, res) => {
    try {
        const message = await Message.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        res.json(message);
    } catch (error) {
        res.status(500).json({ message: 'Error updating status' });
    }
});

// @desc    Delete a message
// @route   DELETE /api/messages/:id
// @access  Admin
router.delete('/:id', async (req, res) => {
    try {
        await Message.findByIdAndDelete(req.params.id);
        res.json({ message: 'Message deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting message' });
    }
});

export default router;
