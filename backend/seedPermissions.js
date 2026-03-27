require('dotenv').config();
const mongoose = require('mongoose');
const Permission = require('./src/models/Permission');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Cleaning Permissions collection...');
    await Permission.deleteMany({});
    
    const pages = [
      'dashboard', 'members', 'payments', 'payment-methods', 
      'reports', 'users', 'permissions', 'profile'
    ];

    const adminPermissions = {
      role: 'Admin',
      pages: pages.map(name => ({
        name,
        actions: { view: true, create: true, update: true, delete: true, markPaid: true, export: true }
      }))
    };

    const staffPermissions = {
      role: 'Staff',
      pages: pages.map(name => ({
        name,
        actions: { 
          view: true, 
          create: name === 'payments' || name === 'members', 
          update: name === 'members', 
          delete: false, 
          markPaid: name === 'payments', 
          export: name === 'reports' 
        }
      }))
    };

    await Permission.create([adminPermissions, staffPermissions]);
    console.log('Permissions seeded successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
seed();
