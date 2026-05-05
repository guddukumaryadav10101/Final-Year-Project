const Question = require('../models/Question');
const Result = require('../models/Result');
const User = require('../models/User');
const xlsx = require('xlsx');

// 1. DASHBOARD STATS
exports.stats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'student' });
    const totalTests = await Question.distinct('mockTestName');
    const totalResults = await Result.countDocuments();
    
    res.json({
      success: true,
      data: { users: totalUsers, tests: totalTests.length, results: totalResults }
    });
  } catch (err) {
    res.status(500).json({ msg: "Stats fetch failed" });
  }
};

// 2. EXCEL UPLOAD (Buffer Mode) - With Update Logic
exports.createMockWithExcel = async (req, res) => {
  try {
    const { mockTestName } = req.body;
    if (!req.file) return res.status(400).json({ msg: "Excel file select kijiye!" });

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

    // Bulk operations array taiyar karna
    const operations = data.map((item) => ({
      updateOne: {
        filter: { 
          mockTestName: mockTestName.trim(), 
          questionNumber: Number(item.questionNumber) 
        },
        update: {
          $set: {
            text: String(item.text).trim(),
            options: [String(item.A), String(item.B), String(item.C), String(item.D)],
            correctAnswer: String(item.correctAnswer).toUpperCase().trim(),
            section: String(item.section).toUpperCase().trim(),
            marks: { positive: 4, negative: 1 }
          }
        },
        upsert: true // Mil gaya toh update, nahi toh naya insert
      }
    }));

    await Question.bulkWrite(operations);
    res.json({ success: true, msg: `Excel Synced: ${data.length} Questions processed! 🎉` });
  } catch (err) {
    console.error("💥 Excel Error:", err.message);
    res.status(500).json({ error: "Excel Sync Failed", details: err.message });
  }
};

// 3. MANUAL UPLOAD (Final Version - Direct Update/Insert)
exports.uploadManual = async (req, res) => {
  try {
    const { mockTestName, questions } = req.body;

    if (!questions || questions.length === 0) {
      return res.status(400).json({ msg: "Questions array is empty!" });
    }

    // Bulk operations array taiyar karna taaki har question check ho sake
    const operations = questions.map((q) => {
      if (!q.text || !q.options || q.options.some(opt => !opt)) {
        throw new Error(`Question ${q.questionNumber} is incomplete!`);
      }

      return {
        updateOne: {
          filter: { 
            mockTestName: (mockTestName || "Untitled Mock").trim(), 
            questionNumber: Number(q.questionNumber) 
          },
          update: {
            $set: {
              text: q.text.trim(),
              options: q.options.map(opt => String(opt).trim()),
              correctAnswer: q.correctAnswer.toUpperCase().trim(),
              section: (q.section || "MATHEMATICS").toUpperCase().trim(),
              marks: { positive: 4, negative: 1 }
            }
          },
          upsert: true // Yeh logic wahi document update karega jo already exists hai
        }
      };
    });

    // bulkWrite database hit kam karta hai aur fast hota hai
    await Question.bulkWrite(operations);
    
    res.json({ success: true, msg: "Database Synced! Purane questions update ho gaye hain. 🚀" });
  } catch (err) {
    console.error("💥 Manual Upload Error:", err.message);
    res.status(500).json({ error: "Deploy Failed", details: err.message });
  }
};

// 4. ANALYTICS & MANAGEMENT (No changes needed here)
exports.analytics = async (req, res) => {
  try {
    const results = await Result.find().populate('user', 'name');
    res.json({ success: true, data: results });
  } catch (err) { res.status(500).json({ msg: "Analytics failed" }); }
};

exports.getTestSummary = async (req, res) => {
  try {
    const tests = await Question.aggregate([{ $group: { _id: "$mockTestName", totalQuestions: { $sum: 1 } } }]);
    res.json({ success: true, data: tests });
  } catch (err) { res.status(500).json({ msg: "Summary failed" }); }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'student' }).select('-password');
    res.json(users);
  } catch (err) { res.status(500).send("Server Error"); }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: "User removed" });
  } catch (err) { res.status(500).send("Server Error"); }
};

exports.getMocks = async (req, res) => {
  try {
    const mocks = await Question.distinct('mockTestName');
    res.json(mocks);
  } catch (err) { res.status(500).send("Server Error"); }
};

exports.deleteMock = async (req, res) => {
  try {
    await Question.deleteMany({ mockTestName: req.params.name });
    res.json({ msg: "Mock Test deleted" });
  } catch (err) { res.status(500).send("Server Error"); }
};