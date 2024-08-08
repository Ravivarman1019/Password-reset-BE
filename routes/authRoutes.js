const express = require('express');
const { forgetPassword, resetPassword } = require('../controllers/authController');

const router = express.Router();

router.post('/forget-password', forgetPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
