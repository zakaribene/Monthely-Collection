const express = require('express');
const router = express.Router();
const { getReportData } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/permissionMiddleware');

router.get('/', protect, checkPermission('reports', 'view'), getReportData);

module.exports = router;
