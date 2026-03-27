require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const bcrypt = require('bcryptjs');

const check = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const user = await User.findOne({ username: 'admin' });
    if (!user) {
      console.log('User not found');
    } else {
      console.log('User found:', user.username);
      const isMatch = await bcrypt.compare('admin123', user.password);
      console.log('Password match test (admin123):', isMatch);
    }
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
check();
