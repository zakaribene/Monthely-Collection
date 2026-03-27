const express = require('express');
const router = express.Router();
const { getPaymentMethods, createPaymentMethod, updatePaymentMethod, deletePaymentMethod } = require('../controllers/paymentMethodController');
const { protect } = require('../middleware/authMiddleware');
const { checkPermission, checkAnyPermission } = require('../middleware/permissionMiddleware');

router.route('/')
  .get(protect, checkAnyPermission([
    { page: 'payment-methods', action: 'view' },
    { page: 'payments', action: 'markPaid' }
  ]), getPaymentMethods)
  .post(protect, checkPermission('payment-methods', 'create'), createPaymentMethod);

router.route('/:id')
  .put(protect, checkPermission('payment-methods', 'update'), updatePaymentMethod)
  .delete(protect, checkPermission('payment-methods', 'delete'), deletePaymentMethod);

module.exports = router;
