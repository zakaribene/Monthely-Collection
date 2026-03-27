const mongoose = require('mongoose');
require('dotenv').config();
const PaymentMethod = require('./src/models/PaymentMethod');

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const methods = await PaymentMethod.find({});
    console.log(`Found ${methods.length} payment methods:`);
    methods.forEach(m => console.log(`- ${m.name} (${m._id})`));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
check();
