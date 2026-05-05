const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Multer storage configuration for better file handling
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage: storage });

const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

// --- DASHBOARD & ANALYTICS ---
// In routes se graphs aur top cards (Total Students, etc.) ka data aayega
router.get('/stats', authMiddleware, adminController.stats);
router.get('/analytics', authMiddleware, adminController.analytics); // For Line Chart
router.get('/test-summary', authMiddleware, adminController.getTestSummary); // For Bar Chart

// --- USER MANAGEMENT ---
router.get('/users', authMiddleware, adminController.getUsers);
router.delete('/users/:id', authMiddleware, adminController.deleteUser);

// --- MOCK TEST & QUESTION MANAGEMENT ---
router.get('/mocks', authMiddleware, adminController.getMocks); // Get all sets
router.get('/mocks/:name', authMiddleware, adminController.getMockQuestions); // Jump to specific set questions
router.delete('/mocks/:name', authMiddleware, adminController.deleteMock);

// --- EXCEL UPLOAD LOGIC ---
// createMockWithExcel: Isse naya set name aur 120 questions ek saath add honge
router.post('/create-mock', authMiddleware, upload.single('file'), adminController.createMockWithExcel);

// upload-questions: Existing set mein questions add karne ke liye
router.post('/upload-questions', authMiddleware, upload.single('file'), adminController.uploadExcel);

module.exports = router;