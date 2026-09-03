import { PrismaClient, BoardRole, TaskPriority } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  // Clean existing records to allow idempotent runs
  await prisma.task.deleteMany();
  await prisma.column.deleteMany();
  await prisma.boardMember.deleteMany();
  await prisma.board.deleteMany();
  await prisma.user.deleteMany();

  const saltRounds = 10;
  const defaultPassword = await bcrypt.hash('Password123!', saltRounds);

  // 1. Seed Primary Users
  const alex = await prisma.user.create({
    data: {
      email: 'alex.morgan@example.com',
      name: 'Alex Morgan',
      passwordHash: defaultPassword,
    },
  });

  const sarah = await prisma.user.create({
    data: {
      email: 'sarah.connor@example.com',
      name: 'Sarah Connor',
      passwordHash: defaultPassword,
    },
  });

  // 2. Seed Primary Collaborative Board
  const engineeringBoard = await prisma.board.create({
    data: {
      title: 'Platform Engineering & Launch',
      description: 'Core product roadmap, backend services, and interactive frontend deliverables.',
      ownerId: alex.id,
      members: {
        create: [
          {
            userId: alex.id,
            role: BoardRole.OWNER,
          },
          {
            userId: sarah.id,
            role: BoardRole.MEMBER,
          },
        ],
      },
    },
  });

  // 3. Seed Workflow Columns
  const backlogCol = await prisma.column.create({
    data: {
      title: 'Backlog',
      position: 0,
      boardId: engineeringBoard.id,
    },
  });

  const inProgressCol = await prisma.column.create({
    data: {
      title: 'In Progress',
      position: 1,
      boardId: engineeringBoard.id,
    },
  });

  const reviewCol = await prisma.column.create({
    data: {
      title: 'Code Review',
      position: 2,
      boardId: engineeringBoard.id,
    },
  });

  const doneCol = await prisma.column.create({
    data: {
      title: 'Done',
      position: 3,
      boardId: engineeringBoard.id,
    },
  });

  // 4. Seed Realistic Tasks
  const tasksData = [
    {
      title: 'Implement JWT Token Authentication & Passport Strategy',
      description: 'Create AuthModule with registration, login, bcrypt password hashing, and Bearer token verification.',
      position: 0,
      priority: TaskPriority.URGENT,
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // +2 days
      columnId: inProgressCol.id,
      assigneeId: alex.id,
    },
    {
      title: 'Design Anti-IDOR Authorization Guards',
      description: 'Ensure users cannot query, mutate, or move tasks across boards they lack explicit membership for.',
      position: 1,
      priority: TaskPriority.HIGH,
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // +3 days
      columnId: inProgressCol.id,
      assigneeId: alex.id,
    },
    {
      title: 'Build Tactile Drag-and-Drop Board View',
      description: 'Implement column reordering and cross-column task drop with 1.5-degree card tilt and ghost indicator.',
      position: 0,
      priority: TaskPriority.HIGH,
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4), // +4 days
      columnId: backlogCol.id,
      assigneeId: sarah.id,
    },
    {
      title: 'Atomic Task Movement Transaction Engine',
      description: 'Wrap same-column index shifts and cross-column card transfers in an isolated Prisma.$transaction.',
      position: 1,
      priority: TaskPriority.URGENT,
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1), // +1 day
      columnId: backlogCol.id,
      assigneeId: alex.id,
    },
    {
      title: 'Frontend Optimistic UI & Error Rollback',
      description: 'Update local React state immediately on drop; revert seamlessly and display toast alert on network failure.',
      position: 0,
      priority: TaskPriority.MEDIUM,
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5), // +5 days
      columnId: reviewCol.id,
      assigneeId: sarah.id,
    },
    {
      title: 'Relational Database Schema & PostgreSQL Indices',
      description: 'Configure compound index on [boardId, position] and [columnId, position] for O(log n) lookups.',
      position: 0,
      priority: TaskPriority.MEDIUM,
      dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), // Yesterday (Completed)
      columnId: doneCol.id,
      assigneeId: alex.id,
    },
  ];

  for (const task of tasksData) {
    await prisma.task.create({ data: task });
  }
}

main()
  .catch((e: unknown) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
