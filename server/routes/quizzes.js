const express = require('express');
const router = express.Router();
const controller = require('../controllers/quizController');
const { requireAdmin } = require('../middleware/auth');

// List published quizzes (public)
router.get('/', controller.listQuizzes);

// Create quiz (admin) - protected by simple header-based admin password
router.post('/', requireAdmin, controller.createQuiz);

// Admin list all quizzes
router.get('/admin', requireAdmin, controller.listAllQuizzes);

// Get a single quiz (without correct answers)
router.get('/:id', controller.getQuiz);

// Submit an attempt
router.post('/:id/attempt', controller.submitAttempt);

module.exports = router;
