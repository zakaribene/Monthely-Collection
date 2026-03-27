require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Role = require('./src/models/Role');
const Permission = require('./src/models/Permission');

const debugPermissions = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('--- DEBUG PERMISSIONS ---');

    const adminUser = await User.findOne({ username: 'admin' }).populate('roleId');
    console.log('Admin User:', JSON.stringify(adminUser, null, 2));

    if (!adminUser) {
      console.log('ERROR: Admin user not found');
    } else {
      const adminPerms = await Permission.findOne({ roleId: adminUser.roleId?._id });
      console.log('Admin Permissions:', JSON.stringify(adminPerms, null, 2));
      
      if (adminPerms) {
        const permPage = adminPerms.pages.find(p => p.name === 'permissions');
        console.log('Permissions page config:', JSON.stringify(permPage, null, 2));
      }
    }

    const allRoles = await Role.find();
    console.log('All Roles:', JSON.stringify(allRoles, null, 2));

    const allPerms = await Permission.find().populate('roleId', 'name');
    console.log('All Permissions:', JSON.stringify(allPerms, null, 2));

    process.exit();
  } catch (error) {
    console.error('Debug Error:', error);
    process.exit(1);
  }
};

debugPermissions();
