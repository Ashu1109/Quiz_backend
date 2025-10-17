const express = require('express');
const chatController = require('../controllers/chatController');
const { authenticateJWT } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateJWT);

// Get all conversations
router.get('/conversations', chatController.getConversations);

// Get specific conversation
router.get('/conversations/:id', chatController.getConversation);

// Create new conversation
router.post('/conversations', chatController.createConversation);

// Send message
router.post('/messages', chatController.sendMessage);

// Delete conversation
router.delete('/conversations/:id', chatController.deleteConversation);

module.exports = router;
