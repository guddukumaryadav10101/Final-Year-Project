const express = require('express');
const router = express.Router();
const multer = require('multer');
const adminController = require('../controllers/adminController');
console.log("Controller Functions:", Object.keys(adminController));
const adminAuth = require('../middleware/adminAuth');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// DASHBOARD
router.get('/stats', adminAuth, adminController.stats); 
router.get('/analytics', adminAuth, adminController.analytics);
router.get('/test-summary', adminAuth, adminController.getTestSummary);

// UPLOAD (Check function names here!)
// Agar controller mein 'uploadExcel' naam hai, toh yahan bhi wahi likho
router.post('/upload-excel', adminAuth, upload.single('file'), adminController.createMockWithExcel);

// MANUAL UPLOAD (Ensure this exists in adminController.js)
router.post('/upload-manual', adminAuth, adminController.uploadManual);

// MANAGEMENT
router.get('/users', adminAuth, adminController.getUsers);
router.delete('/user/:id', adminAuth, adminController.deleteUser);
router.get('/mocks', adminAuth, adminController.getMocks);
router.delete('/mock/:name', adminAuth, adminController.deleteMock);

module.exports = router;