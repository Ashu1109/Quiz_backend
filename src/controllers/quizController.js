const prisma = require('../config/database');

// Get all quizzes
exports.getQuizzes = async (req, res) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      include: {
        _count: {
          select: { questions: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ quizzes });
  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get a specific quiz
exports.getQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        _count: {
          select: { questions: true },
        },
      },
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.json({ quiz });
  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Start a quiz (get questions without correct answers)
exports.startQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          select: {
            id: true,
            question: true,
            optionA: true,
            optionB: true,
            optionC: true,
            optionD: true,
            order: true,
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.json({
      quiz: {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        timeLimit: quiz.timeLimit,
        questions: quiz.questions,
      },
    });
  } catch (error) {
    console.error('Start quiz error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Submit quiz
exports.submitQuiz = async (req, res) => {
  try {
    const { quizId, answers, timeTaken, startedAt } = req.body;

    // Get quiz with questions
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true },
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Calculate score
    let correctAnswers = 0;
    let wrongAnswers = 0;
    const userAnswers = [];

    for (const answer of answers) {
      const question = quiz.questions.find((q) => q.id === answer.questionId);
      if (question) {
        const isCorrect = question.correctAnswer === answer.selectedAnswer;
        if (isCorrect) correctAnswers++;
        else wrongAnswers++;

        userAnswers.push({
          questionId: answer.questionId,
          selectedAnswer: answer.selectedAnswer,
          isCorrect,
        });
      }
    }

    const score = Math.round((correctAnswers / quiz.questions.length) * 100);

    // Create quiz attempt
    const attempt = await prisma.userQuizAttempt.create({
      data: {
        userId: req.user.id,
        quizId,
        score,
        totalQuestions: quiz.questions.length,
        correctAnswers,
        wrongAnswers,
        timeTaken,
        startedAt: new Date(startedAt),
        completedAt: new Date(),
        userAnswers: {
          create: userAnswers,
        },
      },
      include: {
        userAnswers: {
          include: {
            question: true,
          },
        },
      },
    });

    res.json({
      attempt: {
        id: attempt.id,
        score: attempt.score,
        correctAnswers: attempt.correctAnswers,
        wrongAnswers: attempt.wrongAnswers,
        totalQuestions: attempt.totalQuestions,
        timeTaken: attempt.timeTaken,
        completedAt: attempt.completedAt,
      },
      userAnswers: attempt.userAnswers,
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get quiz attempt details
exports.getQuizAttempt = async (req, res) => {
  try {
    const { id } = req.params;

    const attempt = await prisma.userQuizAttempt.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
      include: {
        quiz: true,
        userAnswers: {
          include: {
            question: true,
          },
        },
      },
    });

    if (!attempt) {
      return res.status(404).json({ error: 'Quiz attempt not found' });
    }

    res.json({ attempt });
  } catch (error) {
    console.error('Get quiz attempt error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get user's quiz history
exports.getQuizHistory = async (req, res) => {
  try {
    const attempts = await prisma.userQuizAttempt.findMany({
      where: { userId: req.user.id },
      include: {
        quiz: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { completedAt: 'desc' },
    });

    res.json({ attempts });
  } catch (error) {
    console.error('Get quiz history error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create a quiz (admin function - can be extended with role-based auth)
exports.createQuiz = async (req, res) => {
  try {
    const { title, description, timeLimit, questions } = req.body;

    const quiz = await prisma.quiz.create({
      data: {
        title,
        description,
        timeLimit,
        questions: {
          create: questions.map((q, index) => ({
            question: q.question,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            correctAnswer: q.correctAnswer,
            order: index + 1,
          })),
        },
      },
      include: { questions: true },
    });

    res.status(201).json({ quiz });
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
