const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const { authenticateJWT } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateJWT);

// Get overall analytics
router.get('/', analyticsController.getAnalytics);

// Get performance graph data
router.get('/graph', analyticsController.getPerformanceGraph);

// Get subject-wise performance
router.get('/subjects', analyticsController.getSubjectPerformance);

module.exports = router;
