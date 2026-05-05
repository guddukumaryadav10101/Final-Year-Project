// backend/controllers/questionController.js
const Question = require('../models/Question');

exports.bulkUploadQuestions = async (req, res) => {
  try {
    const { questions, testId } = req.body; // Array of questions from frontend/excel

    const formattedQuestions = questions.map(q => ({
      ...q,
      testId: testId,
      // Logic: Subject ke hisab se marks set karna
      marks: q.subject === 'Mathematics' ? 12 : (q.subject === 'General English' ? 4 : 6),
      negativeMarks: q.subject === 'Mathematics' ? -3 : (q.subject === 'General English' ? -1 : -1.5)
    }));

    await Question.insertMany(formattedQuestions);
    res.status(201).json({ msg: "Bhai, saare questions load ho gaye!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};