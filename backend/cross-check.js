const mongoose = require('mongoose');
require('dotenv').config();
const Member = require('./src/models/Member');
const PaymentMethod = require('./src/models/PaymentMethod');

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const members = await Member.find({});
    const methods = await PaymentMethod.find({});
    console.log(`Members count: ${members.length}`);
    if (members.length > 0) console.log(`Example member: ${members[0].fullName}`);
    console.log(`Methods count: ${methods.length}`);
    methods.forEach(m => console.log(`- Method: ${m.name}`));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
check();
