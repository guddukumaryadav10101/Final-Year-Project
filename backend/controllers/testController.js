const Result = require('../models/Result');

exports.submitTest = async (req, res) => {
    try {
        const { mockTestName, score, totalQuestions, correctAnswers, wrongAnswers, unanswered, timeTaken } = req.body;

        // 🔥 Auto-Calculation Logic
        const percentage = Math.round((score / totalQuestions) * 100);
        const status = percentage >= 40 ? 'Pass' : 'Fail'; // 40% passing criteria

        const newResult = new Result({
            user: req.user.id, // Auth middleware se user ID
            mockTestName,
            score,
            percentage,
            totalQuestions,
            correctAnswers,
            wrongAnswers,
            unanswered,
            timeTaken,
            status
        });

        await newResult.save();
        res.status(201).json({ message: "Test Submitted Successfully", result: newResult });
    } catch (err) {
        res.status(500).json({ message: "Error saving result" });
    }
};