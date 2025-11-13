const mongoose = require('mongoose');
const Quiz = require('../models/Quiz');
const Attempt = require('../models/Attempt');
const { evaluateQuiz } = require('../utils/scoring');

function stripCorrectFlags(quiz) {
  const q = quiz.toObject ? quiz.toObject() : JSON.parse(JSON.stringify(quiz));
  if (q.questions) {
    q.questions = q.questions.map(question => {
      const copy = { ...question };
      if (copy.options) {
        copy.options = copy.options.map(opt => ({ text: opt.text }));
      }
      return copy;
    });
  }
  return q;
}

async function listQuizzes(req, res) {
  if (mongoose.connection.readyState !== 1) return res.status(503).json({ error: 'Database not connected' });
  try {
    const quizzes = await Quiz.find({ published: true }).sort({ createdAt: -1 }).lean();
    const stripped = quizzes.map(q => stripCorrectFlags(q));
    res.json(stripped);
  } catch (err) {
    console.error('Error listing quizzes:', err && err.message ? err.message : err);
    res.status(500).json({ error: 'Failed to list quizzes', detail: err && err.message ? err.message : String(err) });
  }
}

async function createQuiz(req, res) {
  if (mongoose.connection.readyState !== 1) return res.status(503).json({ error: 'Database not connected' });
  try {
    const payload = req.body;
    const quiz = new Quiz(payload);
    await quiz.save();
    res.status(201).json(quiz);
  } catch (err) {
    console.error('Error creating quiz:', err && err.message ? err.message : err);
    if (err && err.codeName === 'CommandNotFound') {
      return res.status(500).json({ error: 'MongoDB command not found. Check MONGO_URI and ensure you are using a standard MongoDB connection string (mongodb:// or mongodb+srv://), not an Atlas Data API / SQL endpoint.' });
    }
    res.status(500).json({ error: 'Failed to create quiz', detail: err && err.message ? err.message : String(err) });
  }
}

async function getQuiz(req, res) {
  const id = req.params.id;
  if (mongoose.connection.readyState !== 1) return res.status(503).json({ error: 'Database not connected' });
  try {
    const quiz = await Quiz.findById(id);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    res.json(stripCorrectFlags(quiz));
  } catch (err) {
    console.error('Error fetching quiz:', err && err.message ? err.message : err);
    res.status(500).json({ error: 'Failed to fetch quiz', detail: err && err.message ? err.message : String(err) });
  }
}

async function submitAttempt(req, res) {
  const id = req.params.id;
  if (mongoose.connection.readyState !== 1) return res.status(503).json({ error: 'Database not connected' });
  try {
    const { answers } = req.body; // [{ questionId, value }]
    const quiz = await Quiz.findById(id);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    const result = evaluateQuiz(quiz, answers);
    const attempt = new Attempt({ quizId: id, answers: result.answers, score: result.score });
    await attempt.save();
    return res.json(result);
  } catch (err) {
    console.error('Error submitting attempt:', err && err.message ? err.message : err);
    if (err && err.codeName === 'CommandNotFound') {
      return res.status(500).json({ error: 'MongoDB command not found. Check MONGO_URI and ensure you are using a standard MongoDB connection string (mongodb:// or mongodb+srv://), not an Atlas Data API / SQL endpoint.' });
    }
    res.status(500).json({ error: 'Failed to submit attempt', detail: err && err.message ? err.message : String(err) });
  }
}

module.exports = { listQuizzes, createQuiz, getQuiz, submitAttempt };
// Admin: list all quizzes (including unpublished)
async function listAllQuizzes(req, res) {
  if (mongoose.connection.readyState !== 1) return res.status(503).json({ error: 'Database not connected' });
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 }).lean();
    res.json(quizzes);
  } catch (err) {
    console.error('Error listing all quizzes:', err && err.message ? err.message : err);
    res.status(500).json({ error: 'Failed to list quizzes', detail: err && err.message ? err.message : String(err) });
  }
}

module.exports = { listQuizzes, createQuiz, getQuiz, submitAttempt, listAllQuizzes };
