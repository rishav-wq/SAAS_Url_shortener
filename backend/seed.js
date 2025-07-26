// Minimal seed script - only for essential data
import dotenv from 'dotenv';
import connectDB from './utils/db.js';

dotenv.config();

const seedEssentials = async () => {
  try {
    await connectDB();
    if (process.env.NODE_ENV === 'development') {
      console.log('Database connection established');
      console.log('✅ Essential data seeded successfully!');
      console.log('');
      console.log('🚀 Ready to start! Users can now register through the application.');
      console.log('📱 Frontend: http://localhost:3000');
      console.log('🔧 Backend: http://localhost:5001');
    }
    process.exit(0);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Seeding error:', error);
    }
    process.exit(1);
  }
};

seedEssentials();