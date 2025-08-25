// path: server/prisma/seed.ts

// Use CommonJS require syntax to match the project's tsconfig
const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // Clean up existing data
  await prisma.taskLabel.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.label.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  const password = await hash('password123', 12);

  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test User',
      passwordHash: password,
    },
  });

  const project1 = await prisma.project.create({
    data: {
      title: 'Website Redesign',
      description: 'Complete overhaul of the company website.',
      userId: user.id,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      title: 'Q3 Marketing Campaign',
      description: 'Launch campaign for the new product line.',
      userId: user.id,
    },
  });

  // --- Tasks for Project 1: Website Redesign ---
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(today.getDate() - 2);

  await prisma.task.createMany({
    data: [
      // Overdue task
      {
        title: 'Draft initial design mockups',
        status: 'in_progress',
        priority: 'high',
        dueDate: twoDaysAgo,
        projectId: project1.id,
        position: 1,
      },
      // Due today task
      {
        title: 'Develop homepage layout',
        status: 'todo',
        priority: 'high',
        dueDate: today,
        projectId: project1.id,
        position: 2,
      },
      // Upcoming task
      {
        title: 'Implement user authentication',
        status: 'todo',
        priority: 'medium',
        dueDate: tomorrow,
        projectId: project1.id,
        position: 3,
      },
      // No due date
      {
        title: 'Set up staging environment',
        status: 'done',
        priority: 'low',
        projectId: project1.id,
        position: 4,
      },
    ],
  });

  // --- Tasks for Project 2: Q3 Marketing ---
  await prisma.task.createMany({
    data: [
      {
        title: 'Finalize campaign budget',
        status: 'done',
        priority: 'high',
        dueDate: yesterday,
        projectId: project2.id,
        position: 1,
      },
      {
        title: 'Create social media content calendar',
        status: 'in_progress',
        priority: 'medium',
        dueDate: tomorrow,
        projectId: project2.id,
        position: 2,
      },
      {
        title: 'Contact media partners',
        status: 'todo',
        priority: 'medium',
        projectId: project2.id,
        position: 3,
      },
    ],
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
