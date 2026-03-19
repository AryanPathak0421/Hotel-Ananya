import express from 'express';
import { upload, cloudinary } from '../config/cloudinary.js';
import Media from '../models/Media.js';

const router = express.Router();

// Get all media of a specific type
router.get('/:type', async (req, res) => {
    try {
        const { type } = req.params;
        const media = await Media.find({ type, isActive: true }).sort({ createdAt: -1 });
        res.json(media);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching media' });
    }
});

// Upload media
router.post('/upload', upload('media').single('image'), async (req, res) => {
    try {
        const { type, title, subtext, category } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'No image uploaded' });
        }

        const newMedia = await Media.create({
            imageUrl: req.file.path,
            publicId: req.file.filename,
            type,
            title,
            subtext,
            category
        });

        res.status(201).json(newMedia);
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ message: 'Error uploading media' });
    }
});

// Delete media
router.delete('/:id', async (req, res) => {
    try {
        const media = await Media.findById(req.params.id);
        if (!media) {
            return res.status(404).json({ message: 'Media not found' });
        }

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(media.publicId);

        // Delete from DB
        await Media.findByIdAndDelete(req.params.id);

        res.json({ message: 'Media deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting media' });
    }
});

// Toggle active status
router.patch('/:id/toggle', async (req, res) => {
    try {
        const media = await Media.findById(req.params.id);
        if (!media) {
            return res.status(404).json({ message: 'Media not found' });
        }
        media.isActive = !media.isActive;
        await media.save();
        res.json(media);
    } catch (error) {
        res.status(500).json({ message: 'Error updating media status' });
    }
});

export default router;
