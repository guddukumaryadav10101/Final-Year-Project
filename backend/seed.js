const mongoose = require('mongoose');
// Model ka path dhyan se check karna (Result model zaroori hai)
const Result = require('./models/Result'); 
require('dotenv').config();

// MongoDB Connection Logic
const DB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/nexus_db';

mongoose.connect(DB_URI)
  .then(() => console.log("✅ Nexus Database Connected for Seeding..."))
  .catch(err => console.error("❌ Connection Error:", err));

const seedData = async () => {
  try {
    // Purana data clear kar rahe hain taaki duplicate na ho
    await Result.deleteMany({});
    console.log("🧹 Old records cleared...");

    const dummyResults = [
      {
        user: "65f1a2b3c4d5e6f7a8b9c0d1", // Apni real Admin ya Student ID yahan daal sakte ho
        mockTestName: "Bitcoin Transaction Security",
        score: 90,
        percentage: 90,
        totalQuestions: 20,
        correctAnswers: 18,
        wrongAnswers: 2,
        status: 'Pass',
        date: new Date(Date.now() - 5*24*60*60*1000) // 5 din pehle
      },
      {
        user: "65f1a2b3c4d5e6f7a8b9c0d2",
        mockTestName: "Machine Learning Foundations",
        score: 45,
        percentage: 45,
        totalQuestions: 20,
        correctAnswers: 9,
        wrongAnswers: 11,
        status: 'Fail',
        date: new Date(Date.now() - 3*24*60*60*1000) // 3 din pehle
      },
      {
        user: "65f1a2b3c4d5e6f7a8b9c0d3",
        mockTestName: "Java & Android Studio",
        score: 75,
        percentage: 75,
        totalQuestions: 20,
        correctAnswers: 15,
        wrongAnswers: 5,
        status: 'Pass',
        date: new Date(Date.now() - 1*24*60*60*1000) // Kal ka data
      },
      {
        user: "65f1a2b3c4d5e6f7a8b9c0d1",
        mockTestName: "Advanced AI Concepts",
        score: 85,
        percentage: 85,
        totalQuestions: 10,
        correctAnswers: 8,
        wrongAnswers: 2,
        status: 'Pass',
        date: new Date() // Aaj ka data
      }
    ];

    await Result.insertMany(dummyResults);
    console.log("🚀 Mission Success: 4 Records seeded into the Nexus!");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedData();