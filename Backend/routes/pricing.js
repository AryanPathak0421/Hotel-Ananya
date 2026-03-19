import express from 'express';
import Pricing from '../models/Pricing.js';

const router = express.Router();

// @desc    Get pricing for a room variant
// @route   GET /api/pricing/:variantId
router.get('/:variantId', async (req, res) => {
    try {
        const plans = await Pricing.find({ roomVariant: req.params.variantId });
        res.json(plans);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pricing plans' });
    }
});

// @desc    Get all pricing plans
router.get('/', async (req, res) => {
    try {
        const plans = await Pricing.find({}).populate({
            path: 'roomVariant',
            populate: { path: 'roomType' }
        }).populate('ratePlan');
        res.json(plans);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching all pricing plans' });
    }
});

router.post('/', async (req, res) => {
    try {
        const plan = await Pricing.create(req.body);
        res.status(201).json(plan);
    } catch (error) {
        res.status(500).json({ message: 'Error creating pricing plan' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const plan = await Pricing.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(plan);
    } catch (error) {
        res.status(500).json({ message: 'Error updating pricing plan' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Pricing.findByIdAndDelete(req.params.id);
        res.json({ message: 'Pricing plan deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting pricing plan' });
    }
});

export default router;
