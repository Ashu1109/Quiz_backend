const prisma = require('../config/database');

// Get user analytics overview
exports.getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all attempts
    const attempts = await prisma.userQuizAttempt.findMany({
      where: { userId },
      orderBy: { completedAt: 'asc' },
      include: {
        quiz: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // Calculate statistics
    const totalAttempts = attempts.length;
    const averageScore =
      totalAttempts > 0
        ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / totalAttempts)
        : 0;
    const totalQuestions = attempts.reduce((sum, a) => sum + a.totalQuestions, 0);
    const totalCorrect = attempts.reduce((sum, a) => sum + a.correctAnswers, 0);
    const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    // Get score trends (last 10 attempts)
    const recentAttempts = attempts.slice(-10).map((a) => ({
      id: a.id,
      quizTitle: a.quiz.title,
      score: a.score,
      completedAt: a.completedAt,
    }));

    // Get quiz performance breakdown
    const quizPerformance = {};
    attempts.forEach((attempt) => {
      const quizId = attempt.quiz.id;
      if (!quizPerformance[quizId]) {
        quizPerformance[quizId] = {
          quizId,
          quizTitle: attempt.quiz.title,
          attempts: 0,
          totalScore: 0,
          bestScore: 0,
        };
      }
      quizPerformance[quizId].attempts++;
      quizPerformance[quizId].totalScore += attempt.score;
      quizPerformance[quizId].bestScore = Math.max(
        quizPerformance[quizId].bestScore,
        attempt.score
      );
    });

    const quizStats = Object.values(quizPerformance).map((q) => ({
      ...q,
      averageScore: Math.round(q.totalScore / q.attempts),
    }));

    res.json({
      overview: {
        totalAttempts,
        averageScore,
        accuracy,
        totalQuestions,
        totalCorrect,
      },
      recentAttempts,
      quizStats,
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get performance graph data
exports.getPerformanceGraph = async (req, res) => {
  try {
    const userId = req.user.id;
    const { period = '30' } = req.query; // days

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(period));

    const attempts = await prisma.userQuizAttempt.findMany({
      where: {
        userId,
        completedAt: {
          gte: daysAgo,
        },
      },
      orderBy: { completedAt: 'asc' },
      select: {
        score: true,
        completedAt: true,
      },
    });

    // Group by date
    const performanceByDate = {};
    attempts.forEach((attempt) => {
      const date = attempt.completedAt.toISOString().split('T')[0];
      if (!performanceByDate[date]) {
        performanceByDate[date] = {
          date,
          scores: [],
        };
      }
      performanceByDate[date].scores.push(attempt.score);
    });

    const graphData = Object.values(performanceByDate).map((day) => ({
      date: day.date,
      averageScore: Math.round(day.scores.reduce((sum, s) => sum + s, 0) / day.scores.length),
      attempts: day.scores.length,
    }));

    res.json({ graphData });
  } catch (error) {
    console.error('Get performance graph error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get subject-wise performance (can be extended based on quiz categories)
exports.getSubjectPerformance = async (req, res) => {
  try {
    const userId = req.user.id;

    const attempts = await prisma.userQuizAttempt.findMany({
      where: { userId },
      include: {
        quiz: true,
      },
    });

    // Group by quiz (in production, you might group by category/subject)
    const subjectStats = {};
    attempts.forEach((attempt) => {
      const quizTitle = attempt.quiz.title;
      if (!subjectStats[quizTitle]) {
        subjectStats[quizTitle] = {
          subject: quizTitle,
          totalAttempts: 0,
          totalQuestions: 0,
          correctAnswers: 0,
          averageScore: 0,
          scores: [],
        };
      }
      subjectStats[quizTitle].totalAttempts++;
      subjectStats[quizTitle].totalQuestions += attempt.totalQuestions;
      subjectStats[quizTitle].correctAnswers += attempt.correctAnswers;
      subjectStats[quizTitle].scores.push(attempt.score);
    });

    const subjects = Object.values(subjectStats).map((subject) => ({
      subject: subject.subject,
      totalAttempts: subject.totalAttempts,
      accuracy: Math.round((subject.correctAnswers / subject.totalQuestions) * 100),
      averageScore: Math.round(
        subject.scores.reduce((sum, s) => sum + s, 0) / subject.scores.length
      ),
      bestScore: Math.max(...subject.scores),
    }));

    res.json({ subjects });
  } catch (error) {
    console.error('Get subject performance error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
