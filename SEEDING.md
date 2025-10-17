# Database Seeding

## Overview
The database seeding script populates the database with sample quiz data for testing purposes.

## Available Quizzes

After running the seed script, you'll have 4 quizzes available:

1. **JavaScript Fundamentals** (5 questions, 10 minutes)
   - Variables, functions, operators, data types

2. **React Basics** (6 questions, 15 minutes)
   - Components, hooks, JSX, virtual DOM

3. **Node.js & Express** (5 questions, 12 minutes)
   - Runtime environment, HTTP server, middleware, npm

4. **Database Fundamentals** (6 questions, 15 minutes)
   - SQL, NoSQL, primary/foreign keys, ACID properties

## How to Run

### First Time Setup
```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed the database
npm run prisma:seed
```

### Re-seeding
```bash
npm run prisma:seed
```

**Note:** Running the seed script multiple times will create duplicate quizzes. If you need to reset:

```bash
# Option 1: Delete and recreate database
npm run prisma:migrate reset

# Option 2: Manually delete quizzes from Prisma Studio
npm run prisma:studio
```

## Verification

Check that quizzes were created:
```bash
npm run prisma:studio
```

Navigate to the `Quiz` and `Question` tables to see the data.

## Testing the API

Once you're logged in, you can access the quizzes:

```bash
# Get all quizzes (requires auth token)
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/quiz

# Get specific quiz
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/quiz/:quizId

# Start quiz
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/quiz/:quizId/start
```
