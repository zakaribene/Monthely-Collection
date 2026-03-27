const Payment = require('../models/Payment');
const Member = require('../models/Member');
const Expense = require('../models/Expense');

// @desc    Get report data
// @route   GET /api/reports
// @access  Private
const getReportData = async (req, res, next) => {
  const { month, year, status, paymentMethod, search } = req.query;
  const query = {};
  
  if (month) query.month = Number(month);
  if (year) query.year = Number(year);
  if (status) query.status = status;
  if (paymentMethod) query.paymentMethod = paymentMethod;

  try {
    // If searching by member name
    if (search) {
      const members = await Member.find({ 
        fullName: { $regex: search, $options: 'i' } 
      });
      query.member = { $in: members.map(m => m._id) };
    }

    const data = await Payment.find(query)
      .populate('member')
      .populate('paymentMethod')
      .sort({ year: -1, month: -1 });

    // Calculate Expenses
    const expenseQuery = {};
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      expenseQuery.date = { $gte: startDate, $lte: endDate };
    } else if (year) {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31, 23, 59, 59);
      expenseQuery.date = { $gte: startDate, $lte: endDate };
    }
    if (paymentMethod) expenseQuery.paymentMethod = paymentMethod;

    const expensesList = await Expense.find(expenseQuery).populate('paymentMethod');
    const totalExpenses = expensesList.reduce((sum, e) => sum + e.amount, 0);
    const totalCollected = data.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);

    // Calculate Summary
    const summary = {
      totalMembers: await Member.countDocuments({ isActive: true }),
      totalPaid: data.filter(p => p.status === 'paid').length,
      totalPending: data.filter(p => p.status === 'pending').length,
      totalCollected: totalCollected,
      totalExpenses: totalExpenses,
      netBalance: totalCollected - totalExpenses
    };

    res.json({ data, expenses: expensesList, summary });
  } catch (error) {
    next(error);
  }
};

module.exports = { getReportData };
