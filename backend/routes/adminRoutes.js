const express = require('express');
const router = express.Router();
const multer = require('multer');
const adminController = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuth');

const upload = multer({ storage: multer.memoryStorage() });

// --- ROUTES ---
router.get('/stats', adminAuth, adminController.stats); 
router.get('/analytics', adminAuth, adminController.analytics);
router.get('/test-summary', adminAuth, adminController.getTestSummary); // <-- Check this line
router.get('/mock-list', adminAuth, adminController.getMockList);
router.get('/mock-questions/:name', adminAuth, adminController.getMockQuestions);
router.post('/upload-excel', adminAuth, upload.single('file'), adminController.createMockWithExcel);
router.post('/upload-manual', adminAuth, adminController.uploadManual);
router.get('/users', adminAuth, adminController.getUsers);
router.delete('/user/:id', adminAuth, adminController.deleteUser);
router.delete('/mock/:name', adminAuth, adminController.deleteMock);

module.exports = router;