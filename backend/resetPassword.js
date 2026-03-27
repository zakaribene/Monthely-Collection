require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const bcrypt = require('bcryptjs');

const reset = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    await User.findOneAndUpdate(
      { username: 'admin' },
      { password: hashedPassword },
      { upsert: true, new: true }
    );
    
    console.log('Admin password reset successful!');
    console.log('Username: admin');
    console.log('Password: admin123');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
reset();
