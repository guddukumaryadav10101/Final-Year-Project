const express = require('express');
const router = express.Router();
const multer = require('multer');
const adminController = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuth');

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit safety ke liye
});

// --- DASHBOARD ROUTES ---
// Fixed: 'stats' ko 'getStats' kar diya hai taaki controller se match kare
router.get('/stats', adminAuth, adminController.getStats); 
router.get('/test-summary', adminAuth, adminController.getTestSummary);
router.get('/analytics', adminAuth, adminController.analytics);

// --- MOCK MANAGEMENT ---
router.get('/mock-list', adminAuth, adminController.getMockList);
router.get('/mock-questions/:name', adminAuth, adminController.getMockQuestions);
router.delete('/mock/:name', adminAuth, adminController.deleteMock);

// --- UPLOAD ROUTES ---
router.post('/upload-excel', adminAuth, upload.single('file'), adminController.createMockWithExcel);
router.post('/upload-manual', adminAuth, adminController.uploadManual);

// --- USER MANAGEMENT ---
router.get('/users', adminAuth, adminController.getUsers);
router.delete('/user/:id', adminAuth, adminController.deleteUser);


// Toh yahan sirf '/mock-list' likhna kaafi hai
router.get('/mock-list', adminAuth, adminController.getMockList);


module.exports = router;