const Question = require('../models/Question');
const getRankPrediction = require('../utils/aiBridge');

exports.submitTest = async (req, res) => {
    try {
        const { answers, userId, testId } = req.body; 
        // answers format: [{ questionId: '...', selectedOption: 0 }, ...]

        let totalScore = 0;
        let subjectBreakdown = {
            Mathematics: 0,
            'Analytical Reasoning': 0,
            'Computer Awareness': 0,
            'General English': 0
        };

        // Sare questions fetch karo jo test me hain
        const questions = await Question.find({ testId });

        questions.forEach(q => {
            const userAnswer = answers.find(a => a.questionId == q._id.toString());
            
            if (userAnswer) {
                if (userAnswer.selectedOption === q.correctOption) {
                    // Sahi hone par marks add karo
                    totalScore += q.marks;
                    subjectBreakdown[q.subject] += q.marks;
                } else {
                    // Galat hone par negative marking
                    totalScore -= q.negativeMarks;
                    subjectBreakdown[q.subject] -= q.negativeMarks;
                }
            }
        });

        // 🤖 Ab AI ko call karo Rank Predict karne ke liye
        const aiAnalysis = await getRankPrediction(totalScore);

        // Final Response
        res.status(200).json({
            status: "success",
            score: totalScore,
            breakdown: subjectBreakdown,
            aiRank: aiAnalysis.predicted_rank,
            admissionChance: aiAnalysis.admission_probability
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Test submission failed" });
    }
};