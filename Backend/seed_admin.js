import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check if admin already exists
        const existing = await User.findOne({ email: 'admin@hotelananya.com' });
        if (existing) {
            console.log('Admin already exists:', existing.email);
            process.exit();
        }

        const admin = await User.create({
            name: 'Hotel Ananya Admin',
            email: 'admin@hotelananya.com',
            password: 'Admin@1234',
            role: 'admin',
            mobile: '9000000000',
            country: 'India',
            city: 'Digha',
            isVerified: true,
            walletBalance: 0
        });

        console.log('✅ Admin created successfully!');
        console.log('-------------------------');
        console.log('  Email   : admin@hotelananya.com');
        console.log('  Password: Admin@1234');
        console.log('-------------------------');
        process.exit();
    } catch (error) {
        console.error('Error creating admin:', error.message);
        process.exit(1);
    }
};

seedAdmin();
