const prisma = require('../config/database');

// Get all conversations for a user
exports.getConversations = async (req, res) => {
  try {
    const conversations = await prisma.conversation.findMany({
      where: { userId: req.user.id },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    res.json({ conversations });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get a specific conversation with messages
exports.getConversation = async (req, res) => {
  try {
    const { id } = req.params;

    const conversation = await prisma.conversation.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json({ conversation });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create a new conversation
exports.createConversation = async (req, res) => {
  try {
    const { title } = req.body;

    const conversation = await prisma.conversation.create({
      data: {
        userId: req.user.id,
        title: title || 'New Conversation',
      },
    });

    res.status(201).json({ conversation });
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, content } = req.body;

    // Verify conversation belongs to user
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        userId: req.user.id,
      },
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Create user message
    const userMessage = await prisma.message.create({
      data: {
        conversationId,
        role: 'user',
        content,
      },
    });

    // Simulate AI response (you can integrate with OpenAI API here)
    const aiResponse = `This is a simulated response to: "${content}". In production, integrate with OpenAI or another AI service.`;

    const assistantMessage = await prisma.message.create({
      data: {
        conversationId,
        role: 'assistant',
        content: aiResponse,
      },
    });

    // Update conversation updatedAt
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    res.json({
      messages: [userMessage, assistantMessage],
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a conversation
exports.deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;

    const conversation = await prisma.conversation.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    await prisma.conversation.delete({
      where: { id },
    });

    res.json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    console.error('Delete conversation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
