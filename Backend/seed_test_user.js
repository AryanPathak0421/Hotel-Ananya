import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const seedUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check if test user exists
        const userExists = await User.findOne({ email: 'user@hotelananya.com' });
        if (userExists) {
            await User.deleteOne({ email: 'user@hotelananya.com' });
            console.log('Existing test user removed');
        }

        // Create a premium test user
        const testUser = await User.create({
            name: 'Aryan Pathak',
            email: 'user@hotelananya.com',
            password: 'User@1234',
            role: 'user',
            mobile: '+91 99887 76655',
            city: 'Kolkata',
            country: 'India',
            walletBalance: 25000, // Enough for multiple bookings
            isVerified: true
        });

        console.log('\n✅ Test User created successfully!');
        console.log('-------------------------');
        console.log(`  Email   : ${testUser.email}`);
        console.log('  Password: User@1234');
        console.log('  Wallet  : ₹25,000');
        console.log('-------------------------\n');

        process.exit();
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seedUser();
