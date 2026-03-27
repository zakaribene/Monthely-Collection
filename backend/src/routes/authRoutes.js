const express = require('express');
const router = express.Router();
const { loginUser, registerUser } = require('../controllers/authController');

const upload = require('../middleware/uploadMiddleware');

router.post('/register', upload.single('photo'), registerUser);
router.post('/login', loginUser);

module.exports = router;
