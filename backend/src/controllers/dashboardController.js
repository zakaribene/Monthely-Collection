const Payment = require('../models/Payment');
const Member = require('../models/Member');
const PaymentMethod = require('../models/PaymentMethod');
const Expense = require('../models/Expense');

// @desc    Get dashboard stats
// @route   GET /api/dashboard
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    const totalMembers = await Member.countDocuments({ isActive: true });
    
    // Aggregations for cards
    const payments = await Payment.find({});
    const totalPaid = payments.filter(p => p.status === 'paid').length;
    const totalPending = payments.filter(p => p.status === 'pending').length;
    const totalMoneyCollected = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);

    // Payment method summary
    const methods = await PaymentMethod.find({});
    const allExpenses = await Expense.find({});
    
    const methodTotals = {};
    for (const method of methods) {
      const methodPayments = payments
        .filter(p => p.status === 'paid' && p.paymentMethod?.toString() === method._id.toString())
        .reduce((sum, p) => sum + p.amount, 0);
        
      const methodExpenses = allExpenses
        .filter(e => e.paymentMethod?.toString() === method._id.toString())
        .reduce((sum, e) => sum + e.amount, 0);
        
      methodTotals[method.name] = methodPayments - methodExpenses;
    }

    // Recent payments
    const recentPayments = await Payment.find({ status: 'paid' })
      .populate('member')
      .populate('paymentMethod')
      .sort({ datePaid: -1 })
      .limit(5);

    res.json({
      cards: {
        totalMembers,
        totalPaid,
        totalPending,
        totalMoneyCollected
      },
      methodTotals,
      recentPayments
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats };
