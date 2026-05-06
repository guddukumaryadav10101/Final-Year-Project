const Question = require('../models/Question');
const Result = require('../models/Result');
const User = require('../models/User');
const xlsx = require('xlsx');

// 1. STATS - Dashboard data
exports.getStats = async (req, res) => {
  try {
    const [totalUsers, totalTests, totalQuestions] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Question.distinct('mockTestName'),
      Question.countDocuments()
    ]);
    
    res.json({ 
      success: true, 
      totalStudents: totalUsers, 
      activeTests: totalTests.length, 
      totalQuestions: totalQuestions,
      avgScore: 0 
    });
  } catch (err) { 
    res.status(500).json({ msg: "Stats failed", error: err.message }); 
  }
};

// 2. TEST SUMMARY - Formatting for Charts
exports.getTestSummary = async (req, res) => {
  try {
    const summary = await Question.aggregate([
      { 
        $group: { 
          _id: "$mockTestName", // Don't change this
          count: { $sum: 1 } 
        } 
      },
      {
        $project: {
          name: { $ifNull: ["$_id", "Unnamed Test"] },
          count: 1,
          _id: 0
        }
      },
      { $sort: { name: 1 } }
    ]);
    res.json(summary); 
  } catch (err) { 
    res.status(500).json({ msg: "Summary failed" }); 
  }
};

// 3. GET MOCK LIST (Unified Version for Manage Page & Dropdown)
exports.getMockList = async (req, res) => {
  try {
    const mocks = await Question.aggregate([
      {
        $group: {
          _id: "$mockTestName", // 🔥 FIXED: testName se badal kar mockTestName kar diya
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          name: { $ifNull: ["$_id", "Unnamed Test"] },
          count: 1
        }
      },
      { $sort: { name: 1 } }
    ]);

    console.log("Found Mocks in DB:", mocks);
    res.status(200).json(mocks);
  } catch (error) {
    console.error("Error fetching mock list:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// 4. GET QUESTIONS BY NAME
exports.getMockQuestions = async (req, res) => {
  try {
    const name = decodeURIComponent(req.params.name);
    const questions = await Question.find({ mockTestName: name }).sort({ questionNumber: 1 });
    res.json({ success: true, questions: questions });
  } catch (err) { 
    res.status(500).json({ success: false }); 
  }
};

// 5. MANUAL UPLOAD/UPDATE
exports.uploadManual = async (req, res) => {
  try {
    const { mockTestName, questions } = req.body;
    if (!mockTestName || !questions) return res.status(400).json({ msg: "Missing data" });

    const operations = questions.map((q) => ({
      updateOne: {
        filter: { 
          mockTestName: mockTestName.trim(), 
          questionNumber: Number(q.questionNumber) 
        },
        update: { $set: { ...q, mockTestName: mockTestName.trim() } },
        upsert: true
      }
    }));
    
    await Question.bulkWrite(operations);
    res.json({ success: true, msg: "Database Synced! 🚀" });
  } catch (err) { 
    res.status(500).json({ error: "Sync Failed", detail: err.message }); 
  }
};

// 6. EXCEL UPLOAD
exports.createMockWithExcel = async (req, res) => {
  try {
    const { mockTestName } = req.body;
    if (!req.file || !mockTestName) return res.status(400).json({ msg: "Data missing" });

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    
    const operations = data.map((item) => ({
      updateOne: {
        filter: { 
          mockTestName: mockTestName.trim(), 
          questionNumber: Number(item.questionNumber) 
        },
        update: { 
          $set: { 
            text: item.text, 
            options: [item.A, item.B, item.C, item.D], 
            correctAnswer: item.correctAnswer, 
            section: item.section,
            mockTestName: mockTestName.trim() // Ensure field is set
          } 
        },
        upsert: true
      }
    }));
    
    await Question.bulkWrite(operations);
    res.json({ success: true, msg: "Excel Synced! ✅" });
  } catch (err) { 
    res.status(500).json({ error: "Excel Processing Failed" }); 
  }
};

// 7. USER MANAGEMENT
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'student' }).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Fetch users failed" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, msg: "User removed" });
  } catch (err) {
    res.status(500).json({ msg: "Delete failed" });
  }
};

// 8. DELETE MOCK
exports.deleteMock = async (req, res) => {
  try {
    const name = decodeURIComponent(req.params.name);
    await Question.deleteMany({ mockTestName: name });
    res.json({ success: true, msg: "Mock Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Delete failed" });
  }
};

// 9. ANALYTICS
exports.analytics = async (req, res) => {
  try {
    const results = await Result.find().populate('user', 'name email');
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ msg: "Analytics failed" });
  }
};

