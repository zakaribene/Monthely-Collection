const express = require('express');
const router = express.Router();
const { getPayments, markAsPaid, createPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/permissionMiddleware');

router.route('/')
  .get(protect, checkPermission('payments', 'view'), getPayments)
  .post(protect, checkPermission('payments', 'create'), createPayment);

router.route('/:id/paid')
  .put(protect, checkPermission('payments', 'markPaid'), markAsPaid);

module.exports = router;
