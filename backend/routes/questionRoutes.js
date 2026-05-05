const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const adminAuth = require('../middleware/adminAuth'); // Simple auth

// GET all questions for a mock test, sorted by questionNumber
router.get('/', questionController.getAllQuestions);

// Protected bulk upload
router.post('/bulk', adminAuth, questionController.bulkUploadQuestions);

// Calculate score from user answers
router.post('/calculate-score', questionController.calculateScore);

module.exports = router;

