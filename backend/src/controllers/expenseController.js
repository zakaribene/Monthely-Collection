const Expense = require('../models/Expense');
const Payment = require('../models/Payment');
const auditLog = require('../utils/auditLogger');

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Private
const getExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.find({})
      .populate('paymentMethod', 'name')
      .populate('createdBy', 'username fullName')
      .sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    next(error);
  }
};

// @desc    Create expense
// @route   POST /api/expenses
// @access  Private
const createExpense = async (req, res, next) => {
  try {
    const { description, category, date, paymentMethod } = req.body;
    const amount = Math.abs(Number(req.body.amount));

    if (!amount || amount <= 0) {
      res.status(400);
      return next(new Error('Fadlan geli lacag sax ah.'));
    }

    // Calculate Balance
    const payments = await Payment.find({ paymentMethod: paymentMethod, status: 'paid' });
    const totalPayments = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    
    const expenses = await Expense.find({ paymentMethod: paymentMethod });
    const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    
    const balance = totalPayments - totalExpenses;

    if (amount > balance) {
      res.status(400);
      return next(new Error(`Haraagaagu kuguma filna. Haraaga hadda ku jira waa $${balance}`));
    }

    const expense = await Expense.create({
      amount,
      description,
      category,
      date,
      paymentMethod,
      createdBy: req.user._id
    });

    await auditLog(req.user.username, 'create', 'Expense', `Created expense: ${description} ($${amount})`);
    res.status(201).json(expense);
  } catch (error) {
    next(error);
  }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
const updateExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      res.status(404);
      return next(new Error('Expense not found'));
    }

    const newAmount = Math.abs(Number(req.body.amount || expense.amount));
    const targetMethod = req.body.paymentMethod || expense.paymentMethod;

    // Calculate Balance for validation
    const payments = await Payment.find({ paymentMethod: targetMethod, status: 'paid' });
    const totalPayments = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    
    const expenses = await Expense.find({ paymentMethod: targetMethod, _id: { $ne: expense._id } });
    const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    
    const balance = totalPayments - totalExpenses;

    if (newAmount > balance) {
      res.status(400);
      return next(new Error(`Haraagaagu kuguma filna in aad update garayso. Haraagaagu waa $${balance}`));
    }

    Object.assign(expense, req.body);
    expense.amount = newAmount; // enforce standard positive amount
    const updatedExpense = await expense.save();
    
    await auditLog(req.user.username, 'update', 'Expense', `Updated expense: ${expense.description}`);
    res.json(updatedExpense);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (expense) {
      await expense.deleteOne();
      await auditLog(req.user.username, 'delete', 'Expense', `Deleted expense: ${expense.description}`);
      res.json({ message: 'Expense removed' });
    } else {
      res.status(404);
      next(new Error('Expense not found'));
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense
};
