const express = require('express');
const quizController = require('../controllers/quizController');
const { authenticateJWT } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateJWT);

// Get all quizzes
router.get('/', quizController.getQuizzes);

// Get specific quiz
router.get('/:id', quizController.getQuiz);

// Start quiz (get questions)
router.get('/:id/start', quizController.startQuiz);

// Submit quiz
router.post('/submit', quizController.submitQuiz);

// Get quiz attempt details
router.get('/attempts/:id', quizController.getQuizAttempt);

// Get user's quiz history
router.get('/history/me', quizController.getQuizHistory);

// Create quiz (can add admin middleware here)
router.post('/', quizController.createQuiz);

module.exports = router;
