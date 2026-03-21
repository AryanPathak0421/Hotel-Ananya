import mongoose from 'mongoose';

const termsSchema = new mongoose.Schema({
    lastUpdated: { type: String, default: 'October 15, 2025' },
    sections: [{
        icon: { type: String, required: true }, // lucide icon name
        title: { type: String, required: true },
        content: { type: String, required: true }
    }]
}, { timestamps: true });

export default mongoose.model('Terms', termsSchema);
