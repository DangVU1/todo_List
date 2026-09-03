import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.task.createMany({
    data: [
      {
        title: 'learn about me',
        completed: false,
        deletedAt: null,
      },
      {
        title: 'hide from Tran Thanh',
        completed: true,
        deletedAt: new Date(),
      },
      {
        title: 'learn how to eat',
        completed: true,
        deletedAt: new Date(),
      },
      {
        title: 'sleep',
        completed: true,
        deletedAt: null,
      },
      {
        title: 'learn NestJs',
        completed: false,
        deletedAt: null,
      },
      {
        title: 'sleep again',
        completed: false,
        deletedAt: null,
      },
      {
        title: 'coding tasks',
        completed: false,
        deletedAt: null,
      },
      {
        title: 'eat after learn how to',
        completed: true,
        deletedAt: null,
      },
    ],
  });
}

main()
  .catch(() => {
    console.error();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });