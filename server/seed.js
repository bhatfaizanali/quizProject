#!/usr/bin/env node
require('dotenv').config();
const mongoose = require('mongoose');
const Quiz = require('./models/Quiz');

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('MONGO_URI is not set in environment. Set it in server/.env');
  process.exit(1);
}

async function run() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB for seeding');

    const demo = new Quiz({
      title: 'Demo Quiz',
      description: 'A small demo quiz inserted by seed script',
      published: true,
      questions: [
        {
          prompt: 'What is 2 + 2?',
          type: 'MCQ_SINGLE',
          options: [
            { text: '3', isCorrect: false },
            { text: '4', isCorrect: true }
          ],
          order: 1
        },
        {
          prompt: 'Select fruits',
          type: 'MCQ_MULTIPLE',
          options: [
            { text: 'Apple', isCorrect: true },
            { text: 'Carrot', isCorrect: false },
            { text: 'Banana', isCorrect: true }
          ],
          order: 2
        },
        {
          prompt: 'The sky is blue',
          type: 'TRUE_FALSE',
          options: [
            { text: 'true', isCorrect: true },
            { text: 'false', isCorrect: false }
          ],
          order: 3
        }
      ]
    });

    const saved = await demo.save();
    console.log('Inserted demo quiz with id:', saved._id.toString());
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err && err.message ? err.message : err);
    process.exit(1);
  }
}

run();
