const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOption: { type: Number, required: true }, // Index 0-3
  subject: { 
    type: String, 
    required: true, 
    enum: ['Mathematics', 'Analytical Reasoning', 'Computer Awareness', 'General English'] 
  },
  marks: { type: Number, required: true }, // Logic: Math=12, Reasoning=6, CS=6, English=4
  negativeMarks: { type: Number, required: true }, // Logic: Math=-3, Reasoning=-1.5, CS=-1.5, English=-1
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test' }
});

module.exports = mongoose.model('Question', QuestionSchema);