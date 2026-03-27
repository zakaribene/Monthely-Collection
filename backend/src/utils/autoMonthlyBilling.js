const cron = require('node-cron');
const Member = require('../models/Member');
const Payment = require('../models/Payment');

const runAutoBilling = async () => {
  console.log('Running auto-billing check...');
  try {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const activeMembers = await Member.find({ isActive: true });

    for (const member of activeMembers) {
      // Check if payment record already exists for this month/year
      const existingPayment = await Payment.findOne({
        member: member._id,
        month: currentMonth,
        year: currentYear
      });

      if (!existingPayment) {
        await Payment.create({
          member: member._id,
          month: currentMonth,
          year: currentYear,
          amount: member.monthlyAmount,
          status: 'pending'
        });
        console.log(`Created pending payment for member: ${member.fullName}`);
      }
    }
  } catch (error) {
    console.error('Auto billing error:', error);
  }
};

// Run at the beginning of every month (00:00 on the 1st)
const initAutoBilling = () => {
  cron.schedule('0 0 1 * *', runAutoBilling);
  
  // Also run on server start to catch up if needed
  runAutoBilling();
};

module.exports = { initAutoBilling, runAutoBilling };
