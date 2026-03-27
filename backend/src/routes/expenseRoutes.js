const express = require('express');
const router = express.Router();
const { getExpenses, createExpense, updateExpense, deleteExpense } = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/permissionMiddleware');

router.route('/')
  .get(protect, checkPermission('expenses', 'view'), getExpenses)
  .post(protect, checkPermission('expenses', 'create'), createExpense);

router.route('/:id')
  .put(protect, checkPermission('expenses', 'update'), updateExpense)
  .delete(protect, checkPermission('expenses', 'delete'), deleteExpense);

module.exports = router;
