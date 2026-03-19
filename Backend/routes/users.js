import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
router.get('/', async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
});

// @desc    Update user profile or role (works for both user updating their own profile and admin updating role)
// @route   PUT /api/users/:id
router.put('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            user.name = req.body.name || user.name;
            user.mobile = req.body.mobile || user.mobile;
            user.city = req.body.city || user.city;
            user.country = req.body.country || user.country;

            // Optional admin updates
            user.role = req.body.role || user.role;
            user.walletBalance = req.body.walletBalance !== undefined ? req.body.walletBalance : user.walletBalance;

            const updatedUser = await user.save();
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating user' });
    }
});

export default router;
