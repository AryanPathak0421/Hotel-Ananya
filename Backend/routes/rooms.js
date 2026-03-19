import express from 'express';
import RoomType from '../models/RoomType.js';
import Pricing from '../models/Pricing.js';
import Booking from '../models/Booking.js';
import RoomVariant from '../models/RoomVariant.js';

const router = express.Router();

// @desc    Get all room types with starting price
// @route   GET /api/rooms
router.get('/', async (req, res) => {
    try {
        const roomTypes = await RoomType.find({ isActive: true });

        const enriched = await Promise.all(roomTypes.map(async (type) => {
            const variant = await RoomVariant.findOne({ roomType: type._id });
            const minPlan = variant ? await Pricing.findOne({ roomVariant: variant._id }).sort({ adult2Price: 1 }) : null;
            return {
                ...type.toObject(),
                startingPrice: minPlan ? minPlan.adult2Price : 0
            };
        }));

        res.json(enriched);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching room types' });
    }
});

// Backward compatibility (optional but good for stability)
router.get('/categories', async (req, res) => {
    try {
        const roomTypes = await RoomType.find({ isActive: true });
        const enriched = await Promise.all(roomTypes.map(async (type) => {
            const variant = await RoomVariant.findOne({ roomType: type._id });
            const minPlan = variant ? await Pricing.findOne({ roomVariant: variant._id }).sort({ adult2Price: 1 }) : null;
            return {
                _id: type._id,
                type: type.name,
                size: type.size,
                bed: type.bedType,
                capacity: type.capacity,
                price: minPlan ? minPlan.adult2Price : 0,
                amenities: type.amenities,
                image: type.images[0],
                count: type.totalRooms,
                startingPrice: minPlan ? minPlan.adult2Price : 0,
                images: type.images,
                name: type.name
            };
        }));
        res.json(enriched);
    } catch (error) {
        res.status(500).json({ message: 'Error' });
    }
});

// @desc    Get ALL variants for a room type (including inactive for admin)
router.get('/variants/:roomTypeId', async (req, res) => {
    try {
        const variants = await RoomVariant.find({ roomType: req.params.roomTypeId });
        res.json(variants);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching variants' });
    }
});

// @desc    Create a new variant
router.post('/variants', async (req, res) => {
    try {
        const variant = await RoomVariant.create(req.body);
        res.status(201).json(variant);
    } catch (error) {
        res.status(500).json({ message: 'Error creating variant' });
    }
});

// @desc    Update a variant
router.put('/variants/:id', async (req, res) => {
    try {
        const variant = await RoomVariant.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(variant);
    } catch (error) {
        res.status(500).json({ message: 'Error updating variant' });
    }
});

// @desc    Delete a variant (Cascading delete)
router.delete('/variants/:id', async (req, res) => {
    try {
        await Promise.all([
            RoomVariant.findByIdAndDelete(req.params.id),
            Pricing.deleteMany({ roomVariant: req.params.id })
        ]);
        res.json({ message: 'Variant and associated pricing plans deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting variant' });
    }
});

// @desc    Get pricing for a variant
router.get('/pricing/:variantId', async (req, res) => {
    try {
        const pricing = await Pricing.find({ roomVariant: req.params.variantId }).populate('ratePlan');
        res.json(pricing);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pricing' });
    }
});

// @desc    Get room type details
router.get('/:id', async (req, res) => {
    try {
        const roomType = await RoomType.findById(req.params.id);
        if (roomType) {
            res.json(roomType);
        } else {
            res.status(404).json({ message: 'Room type not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching room details' });
    }
});

// @desc    Check availability (multifaceted)
router.post('/check-availability', async (req, res) => {
    const { roomTypeId, variantId, checkIn, checkOut } = req.body;
    try {
        const roomType = await RoomType.findById(roomTypeId);
        if (!roomType) return res.status(404).json({ message: 'Room type not found' });

        const searchCriteria = {
            roomType: roomTypeId,
            bookingStatus: { $in: ['pending', 'confirmed'] },
            $or: [
                { checkIn: { $lt: checkOut }, checkOut: { $gt: checkIn } }
            ]
        };

        if (variantId) {
            searchCriteria.variant = variantId;
        }

        const existingBookings = await Booking.find(searchCriteria);
        const bookedRooms = existingBookings.reduce((sum, b) => sum + b.roomsCount, 0);

        // If variantId is provided, check against variant total rooms, otherwise check roomType total (if used as general)
        let totalRooms = roomType.totalRooms;
        if (variantId) {
            const variant = await RoomVariant.findById(variantId);
            if (variant) totalRooms = variant.totalRooms;
        }

        const availableCount = totalRooms - bookedRooms;

        res.json({
            available: availableCount > 0,
            availableCount,
            totalRooms
        });
    } catch (error) {
        res.status(500).json({ message: 'Availability check failed' });
    }
});

// Admin Routes
router.post('/', async (req, res) => {
    try {
        const roomType = await RoomType.create(req.body);
        res.status(201).json(roomType);
    } catch (error) {
        res.status(500).json({ message: 'Error creating room type' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const roomType = await RoomType.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(roomType);
    } catch (error) {
        res.status(500).json({ message: 'Error updating room type' });
    }
});

// @desc    Delete a room type (Cascading delete)
router.delete('/:id', async (req, res) => {
    try {
        // 1. Find all variants for this room type
        const variants = await RoomVariant.find({ roomType: req.params.id });
        const variantIds = variants.map(v => v._id);

        // 2. Perform cascading deletion
        await Promise.all([
            Pricing.deleteMany({ roomVariant: { $in: variantIds } }),
            RoomVariant.deleteMany({ roomType: req.params.id }),
            RoomType.findByIdAndDelete(req.params.id)
        ]);

        res.json({ message: 'Room type and all associated data deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting room type and its dependencies' });
    }
});

// @desc    Get real-time availability matrix for 14 days starting from a specific date
// @route   GET /api/rooms/availability-matrix
router.get('/availability-matrix', async (req, res) => {
    try {
        const { startDate } = req.query;
        const initialDate = startDate ? new Date(startDate) : new Date();
        initialDate.setHours(0, 0, 0, 0);

        const roomTypes = await RoomType.find({ isActive: true });
        const dates = Array.from({ length: 14 }, (_, i) => {
            const d = new Date(initialDate);
            d.setDate(initialDate.getDate() + i);
            return d;
        });

        const matrix = await Promise.all(roomTypes.map(async (type) => {
            const availability = await Promise.all(dates.map(async (date) => {
                const nextDate = new Date(date);
                nextDate.setDate(date.getDate() + 1);

                const bookings = await Booking.find({
                    roomType: type._id,
                    bookingStatus: { $in: ['pending', 'confirmed'] },
                    checkIn: { $lt: nextDate },
                    checkOut: { $gt: date }
                });

                const bookedCount = bookings.reduce((sum, b) => sum + b.roomsCount, 0);
                return {
                    date,
                    available: Math.max(0, type.totalRooms - bookedCount),
                    total: type.totalRooms
                };
            }));

            return {
                _id: type._id,
                name: type.name,
                totalRooms: type.totalRooms,
                availability
            };
        }));

        res.json(matrix);
    } catch (error) {
        console.error('Matrix Error:', error);
        res.status(500).json({ message: 'Error generating availability matrix' });
    }
});

export default router;
