const express = require('express');
const router = express.Router();
const { submitTest } = require('../controllers/testController');

// Test submit karne ka endpoint
router.post('/submit', submitTest);

module.exports = router;