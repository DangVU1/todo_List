import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

describe('TasksService', () => {
  let service: TasksService;

  const mockPrismaService = {
    task: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        }
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should create a new task', async () => {
    const dto = {
      title: "New Task",
      completed: false,
    };

    mockPrismaService.task.findFirst.mockResolvedValue(null);

    mockPrismaService.task.create.mockResolvedValue({
      id: 1,
      title: 'New Task',
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    const result = await service.create(dto);

    expect(result).toBeDefined();
    expect(result.title).toBe('New Task');
    expect(result.completed).toBe(false);
  })

  it('should throw ConflictException when title already exists', async () => {
    const dto = {
      title: 'Hide FRom Tran Thanh', // This title already exists in the tasks.data.ts
      completed: false,
    };

    mockPrismaService.task.findFirst.mockResolvedValue({
      id: 1,
      title: 'Hide FRom Tran Thanh',
      completed: false,
    });

    mockPrismaService.task.create.mockResolvedValue({
      id: 1,
      title: 'New Task',
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    await expect(service.create(dto))
      .rejects
      .toThrow(ConflictException);
  });
});

