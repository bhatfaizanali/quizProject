const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema({
  text: String,
  isCorrect: { type: Boolean, default: false },
});

const QuestionSchema = new mongoose.Schema({
  prompt: String,
  type: { type: String, enum: ['MCQ_SINGLE', 'MCQ_MULTIPLE', 'TRUE_FALSE', 'TEXT'] },
  options: [OptionSchema],
  order: Number,
  required: { type: Boolean, default: true },
});

const QuizSchema = new mongoose.Schema({
  title: String,
  description: String,
  published: { type: Boolean, default: false },
  questions: [QuestionSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Quiz', QuizSchema);
