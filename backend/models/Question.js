const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  // Mock Test ka unique name (e.g., NIMCET_MOCK_01)
  mockTestName: { 
    type: String, 
    required: true,
    trim: true 
  },
  
  
  // Question number (1 se 120 ke beech, par 120 se kam bhi ho sakte hain)
  questionNumber: { 
    type: Number, 
    required: true 
  },
  
  text: { 
    type: String, 
    required: true 
  },
  
  // Array of exactly 4 options
  options: {
    type: [String],
    required: true,
    validate: [v => v.length === 4, "Bhai, exactly 4 options chahiye!"]
  },
  
  // Single character answer: A, B, C, or D
  correctAnswer: { 
    type: String, 
    required: true, 
    uppercase: true,
    enum: ['A', 'B', 'C', 'D']
  },
  
  // NIMCET specific sections
  section: {
    type: String,
    required: true,
    uppercase: true,
    enum: ['MATHEMATICS', 'ANALYTICAL', 'COMPUTER', 'ENGLISH']
  },
  
  // Marking scheme (Default +4, -1)
  marks: {
    positive: { type: Number, default: 4 },
    negative: { type: Number, default: 1 }
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexing: Taaki search fast ho (Search Term logic ke liye)
QuestionSchema.index({ mockTestName: 1, section: 1 });



// Nayi "Safe" line:
module.exports = mongoose.models.Question || mongoose.model('Question', QuestionSchema);