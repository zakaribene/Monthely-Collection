require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Role = require('./src/models/Role');
const Permission = require('./src/models/Permission');

const setupAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB...');

    // 1. Create Admin Role if not exists
    let adminRole = await Role.findOne({ name: 'Admin' });
    if (!adminRole) {
      adminRole = await Role.create({
        name: 'Admin',
        description: 'System Administrator with full access'
      });
      console.log('Admin role created.');
    } else {
      console.log('Admin role already exists.');
    }

    // 2. Create Permissions for Admin Role
    const pages = [
      'dashboard', 'members', 'payments', 'payment-methods', 
      'reports', 'users', 'roles', 'permissions', 'profile'
    ];
    
    const fullPagesConfig = pages.map(name => ({
      name,
      actions: { 
        view: true, create: true, update: true, delete: true, 
        markPaid: true, export: true, assignPermissions: true 
      }
    }));

    await Permission.findOneAndUpdate(
      { roleId: adminRole._id },
      { pages: fullPagesConfig },
      { upsert: true, new: true }
    );
    console.log('Admin permissions updated (including roles).');

    // 3. Ensure Admin User exists and has the role
    const adminUser = await User.findOne({ username: 'admin' });
    if (!adminUser) {
      const newUser = new User({
        fullName: 'System Admin',
        username: 'admin',
        password: 'admin123',
        roleId: adminRole._id
      });
      await newUser.save();
      console.log('Admin user created successfully!');
    } else {
      adminUser.roleId = adminRole._id;
      adminUser.password = 'admin123';
      await adminUser.save();
      console.log('Admin user updated and password reset to admin123.');
    }

    process.exit();
  } catch (error) {
    console.error('Error setting up admin:', error);
    process.exit(1);
  }
};

setupAdmin();
