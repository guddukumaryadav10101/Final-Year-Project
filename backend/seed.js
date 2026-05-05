const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Question = require('./models/Question');

connectDB();

const sampleQuestions = [];

// NIMCET_2026_MOCK_01 - 40 questions demo
const mock1Questions = 40;
for (let i = 1; i <= mock1Questions; i++) {
  const sections = ['MATHEMATICS', 'ANALYTICAL', 'COMPUTER', 'ENGLISH'];
  const section = sections[Math.floor((i-1)/10) % 4];
  const marks = section === 'MATHEMATICS' ? {positive:12, negative:3} : 
                section === 'ENGLISH' ? {positive:4, negative:1} : {positive:6, negative:1.5};
  sampleQuestions.push({
    mockTestName: 'NIMCET_2026_MOCK_01',
    questionNumber: i,
    text: `Sample Question ${i} for ${section} section in Mock 01. What is the answer?`,
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correctAnswer: ['A','B','C','D'][Math.floor((i-1)/10) % 4],
    section,
    marks
  });
}

// NIMCET_2026_MOCK_02
for (let i = 1; i <= 40; i++) {
  const sections = ['MATHEMATICS', 'ANALYTICAL', 'COMPUTER', 'ENGLISH'];
  const section = sections[Math.floor((i-1)/10) % 4];
  const marks = section === 'MATHEMATICS' ? {positive:12, negative:3} : 
                section === 'ENGLISH' ? {positive:4, negative:1} : {positive:6, negative:1.5};
  sampleQuestions.push({
    mockTestName: 'NIMCET_2026_MOCK_02',
    questionNumber: i,
    text: `Sample Question ${i} for ${section} section in Mock 02. Test your knowledge.`,
    options: ['A Choice', 'B Choice', 'C Choice', 'D Choice'],
    correctAnswer: ['B','A','D','C'][Math.floor((i-1)/10) % 4],
    section,
    marks
  });
}

// NIMCET_2026_MOCK_03
for (let i = 1; i <= 40; i++) {
  const sections = ['MATHEMATICS', 'ANALYTICAL', 'COMPUTER', 'ENGLISH'];
  const section = sections[Math.floor((i-1)/10) % 4];
  const marks = section === 'MATHEMATICS' ? {positive:12, negative:3} : 
                section === 'ENGLISH' ? {positive:4, negative:1} : {positive:6, negative:1.5};
  sampleQuestions.push({
    mockTestName: 'NIMCET_2026_MOCK_03',
    questionNumber: i,
    text: `Sample Question ${i} for ${section} section in Mock 03. Ready for demo?`,
    options: ['First', 'Second', 'Third', 'Fourth'],
    correctAnswer: ['D','C','A','B'][Math.floor((i-1)/10) % 4],
    section,
    marks
  });
}

const seedQuestions = async () => {
  try {
    await Question.deleteMany({});
    console.log('🗑️ Cleared existing questions');

    const result = await Question.insertMany(sampleQuestions);
    console.log(`✅ Seeded ${result.length} questions across 3 mocks! (40 each for demo)`);
    console.log('🎯 Mocks ready: NIMCET_2026_MOCK_01, _02, _03');
    console.log('🚀 Run frontend/backend servers to test!');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
};

seedQuestions();

