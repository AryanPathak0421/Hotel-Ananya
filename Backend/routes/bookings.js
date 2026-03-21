import express from 'express';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';

const router = express.Router();

// @desc    Create a new booking (multifaceted)
router.post('/', async (req, res) => {
    const {
        userId, roomType, variant, plan, checkIn, checkOut, roomsCount, roomDetails,
        totalPrice, amountPaid = totalPrice, bookingId, paymentMethod = 'wallet', paymentId,
        paymentStatus = 'paid'
    } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (paymentMethod === 'wallet' && user.walletBalance < amountPaid) {
            return res.status(400).json({ message: 'Insufficient wallet balance' });
        }

        if (paymentMethod === 'wallet') {
            user.walletBalance -= amountPaid;
            await user.save();
        }

        // Create transaction record for the amount actually paid
        await Transaction.create({
            user: userId,
            type: 'debit',
            amount: amountPaid,
            description: `Room Booking #${bookingId} (${paymentStatus} payment) via ${paymentMethod}`
        });

        // Create booking
        const booking = await Booking.create({
            user: userId,
            roomType,
            variant,
            plan,
            checkIn,
            checkOut,
            roomsCount,
            roomDetails,
            totalPrice,
            amountPaid,
            remainingBalance: totalPrice - amountPaid,
            bookingId,
            paymentMethod,
            paymentId,
            paymentStatus,
            bookingStatus: 'confirmed'
        });

        res.status(201).json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating booking' });
    }
});

// @desc    Get user bookings
router.get('/my/:userId', async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.params.userId })
            .populate('roomType')
            .populate('variant')
            .populate({ path: 'plan', populate: { path: 'ratePlan' } });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user bookings' });
    }
});

// @desc    Get all bookings (Admin)
router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.find({})
            .populate('user', 'name email')
            .populate('roomType')
            .populate('variant')
            .populate({ path: 'plan', populate: { path: 'ratePlan' } });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching all bookings' });
    }
});

// @desc    Update booking status
router.put('/:id/status', async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(req.params.id, { bookingStatus: req.body.status }, { new: true });
        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Error updating status' });
    }
});

export default router;
