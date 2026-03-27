const mongoose = require('mongoose');
require('dotenv').config();

const Role = require('./src/models/Role');
const Permission = require('./src/models/Permission');
const User = require('./src/models/User');
const PaymentMethod = require('./src/models/PaymentMethod');

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const users = await User.find({}).populate('roleId');
    for (const user of users) {
      if (!user.roleId) {
        console.log(`--- USER: ${user.username} (NO ROLE) ---`);
        continue;
      }
      const perms = await Permission.findOne({ roleId: user.roleId._id });
      console.log(`--- USER: ${user.username} (Role: ${user.roleId.name}) ---`);
      if (perms) {
        perms.pages.forEach(p => {
          if (['payments', 'payment-methods'].includes(p.name)) {
            console.log(`${p.name}: ${JSON.stringify(p.actions)}`);
          }
        });
      } else {
        console.log('No permissions document for this role.');
      }
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
check();
