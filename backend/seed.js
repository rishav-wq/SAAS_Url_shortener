// Example seed script (e.g., backend/seed.js)
require('dotenv').config();
const connectDB = require('./utils/db');
const User = require('./models/User');

connectDB();

const seedUser = async () => {
  try {
    await User.deleteMany(); // Clear existing users (optional)

    const user = new User({
      email: 'intern@dacoid.com',
      password: 'Test123', // Password will be hashed by pre-save hook
    });

    await user.save();
    console.log('User seeded!');
    process.exit();
  } catch (error) {
    console.error('Error seeding user:', error);
    process.exit(1);
  }
};

seedUser();