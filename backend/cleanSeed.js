require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

const sanitizeAndSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Cleaning Users collection...');
    await User.deleteMany({});
    
    console.log('Creating fresh admin user...');
    // Create using the model so the pre-save hook for hashing runs
    const admin = new User({
      fullName: 'System Admin',
      username: 'admin',
      password: 'password123', // I'll use a very standard password
      role: 'Admin'
    });

    await admin.save();
    console.log('Fresh admin created!');
    console.log('Username: admin');
    console.log('Password: password123');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
sanitizeAndSeed();
