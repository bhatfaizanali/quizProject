const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  questionId: String,
  value: mongoose.Schema.Types.Mixed, // string, array, boolean, etc.
  isCorrect: Boolean,
});

const AttemptSchema = new mongoose.Schema({
  quizId: String,
  answers: [AnswerSchema],
  score: Number,
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Attempt', AttemptSchema);
