const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create dummy quizzes
  const quiz1 = await prisma.quiz.create({
    data: {
      title: 'JavaScript Fundamentals',
      description: 'Test your knowledge of JavaScript basics including variables, functions, and data types.',
      timeLimit: 600, // 10 minutes
      questions: {
        create: [
          {
            question: 'What is the correct way to declare a variable in JavaScript?',
            optionA: 'var myVar = 10;',
            optionB: 'variable myVar = 10;',
            optionC: 'v myVar = 10;',
            optionD: 'dim myVar = 10;',
            correctAnswer: 'A',
            order: 1,
          },
          {
            question: 'Which method is used to add an element to the end of an array?',
            optionA: 'append()',
            optionB: 'push()',
            optionC: 'add()',
            optionD: 'insert()',
            correctAnswer: 'B',
            order: 2,
          },
          {
            question: 'What does "===" operator do in JavaScript?',
            optionA: 'Compares values only',
            optionB: 'Compares types only',
            optionC: 'Compares both value and type',
            optionD: 'Assigns a value',
            correctAnswer: 'C',
            order: 3,
          },
          {
            question: 'Which of the following is NOT a JavaScript data type?',
            optionA: 'String',
            optionB: 'Boolean',
            optionC: 'Float',
            optionD: 'Undefined',
            correctAnswer: 'C',
            order: 4,
          },
          {
            question: 'What is the output of: typeof null?',
            optionA: 'null',
            optionB: 'undefined',
            optionC: 'object',
            optionD: 'number',
            correctAnswer: 'C',
            order: 5,
          },
        ],
      },
    },
  });

  const quiz2 = await prisma.quiz.create({
    data: {
      title: 'React Basics',
      description: 'Learn about React components, hooks, and state management fundamentals.',
      timeLimit: 900, // 15 minutes
      questions: {
        create: [
          {
            question: 'What is JSX in React?',
            optionA: 'A JavaScript library',
            optionB: 'A syntax extension for JavaScript',
            optionC: 'A CSS framework',
            optionD: 'A database',
            correctAnswer: 'B',
            order: 1,
          },
          {
            question: 'Which hook is used to manage state in functional components?',
            optionA: 'useEffect',
            optionB: 'useState',
            optionC: 'useContext',
            optionD: 'useReducer',
            correctAnswer: 'B',
            order: 2,
          },
          {
            question: 'What is the virtual DOM in React?',
            optionA: 'A copy of the real DOM kept in memory',
            optionB: 'A cloud storage service',
            optionC: 'A CSS property',
            optionD: 'A JavaScript function',
            correctAnswer: 'A',
            order: 3,
          },
          {
            question: 'How do you pass data from parent to child component?',
            optionA: 'Using state',
            optionB: 'Using props',
            optionC: 'Using refs',
            optionD: 'Using context',
            correctAnswer: 'B',
            order: 4,
          },
          {
            question: 'What does useEffect hook do?',
            optionA: 'Manages component state',
            optionB: 'Handles side effects',
            optionC: 'Creates routes',
            optionD: 'Styles components',
            correctAnswer: 'B',
            order: 5,
          },
          {
            question: 'Which method is called after a component is mounted?',
            optionA: 'componentWillMount',
            optionB: 'componentDidMount',
            optionC: 'componentWillUpdate',
            optionD: 'componentDidUpdate',
            correctAnswer: 'B',
            order: 6,
          },
        ],
      },
    },
  });

  const quiz3 = await prisma.quiz.create({
    data: {
      title: 'Node.js & Express',
      description: 'Test your understanding of backend development with Node.js and Express framework.',
      timeLimit: 720, // 12 minutes
      questions: {
        create: [
          {
            question: 'What is Node.js?',
            optionA: 'A JavaScript library',
            optionB: 'A JavaScript runtime environment',
            optionC: 'A database',
            optionD: 'A frontend framework',
            correctAnswer: 'B',
            order: 1,
          },
          {
            question: 'Which module is used to create a web server in Node.js?',
            optionA: 'fs',
            optionB: 'path',
            optionC: 'http',
            optionD: 'url',
            correctAnswer: 'C',
            order: 2,
          },
          {
            question: 'What does npm stand for?',
            optionA: 'Node Package Manager',
            optionB: 'New Project Manager',
            optionC: 'Node Programming Model',
            optionD: 'Network Package Manager',
            correctAnswer: 'A',
            order: 3,
          },
          {
            question: 'Which Express method is used to handle GET requests?',
            optionA: 'app.fetch()',
            optionB: 'app.get()',
            optionC: 'app.request()',
            optionD: 'app.retrieve()',
            correctAnswer: 'B',
            order: 4,
          },
          {
            question: 'What is middleware in Express?',
            optionA: 'A database layer',
            optionB: 'Functions that execute during request-response cycle',
            optionC: 'A frontend component',
            optionD: 'A testing framework',
            correctAnswer: 'B',
            order: 5,
          },
        ],
      },
    },
  });

  const quiz4 = await prisma.quiz.create({
    data: {
      title: 'Database Fundamentals',
      description: 'Questions about SQL, NoSQL, and database design principles.',
      timeLimit: 900, // 15 minutes
      questions: {
        create: [
          {
            question: 'What does SQL stand for?',
            optionA: 'Structured Query Language',
            optionB: 'Simple Question Language',
            optionC: 'Standard Query Language',
            optionD: 'Server Query Language',
            correctAnswer: 'A',
            order: 1,
          },
          {
            question: 'Which command is used to retrieve data from a database?',
            optionA: 'GET',
            optionB: 'FETCH',
            optionC: 'SELECT',
            optionD: 'RETRIEVE',
            correctAnswer: 'C',
            order: 2,
          },
          {
            question: 'What is a primary key?',
            optionA: 'A key that opens the database',
            optionB: 'A unique identifier for a record',
            optionC: 'The first column in a table',
            optionD: 'A password',
            correctAnswer: 'B',
            order: 3,
          },
          {
            question: 'Which of these is a NoSQL database?',
            optionA: 'MySQL',
            optionB: 'PostgreSQL',
            optionC: 'MongoDB',
            optionD: 'Oracle',
            correctAnswer: 'C',
            order: 4,
          },
          {
            question: 'What does ACID stand for in database transactions?',
            optionA: 'Atomicity, Consistency, Isolation, Durability',
            optionB: 'Access, Control, Identity, Data',
            optionC: 'Authentication, Connection, Integration, Deployment',
            optionD: 'Automatic, Continuous, Independent, Dynamic',
            correctAnswer: 'A',
            order: 5,
          },
          {
            question: 'What is a foreign key?',
            optionA: 'A key from another country',
            optionB: 'A field that links two tables',
            optionC: 'A backup key',
            optionD: 'An encryption key',
            correctAnswer: 'B',
            order: 6,
          },
        ],
      },
    },
  });

  console.log('✅ Created quizzes:');
  console.log(`  - ${quiz1.title} (${quiz1.id})`);
  console.log(`  - ${quiz2.title} (${quiz2.id})`);
  console.log(`  - ${quiz3.title} (${quiz3.id})`);
  console.log(`  - ${quiz4.title} (${quiz4.id})`);
  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
