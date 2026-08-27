import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { ConflictException } from '@nestjs/common';

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should create a new task',()=>{
    const dto = {
      title: "New Task",
      completed: false,
    };
    const result = service.create(dto);

    expect(result).toBeDefined();
    expect(result.title).toBe('New Task');
    expect(result.completed).toBe(false);
  })

  it('should throw ConflictException when title already exists', () => {
    const dto = {
      title: 'Hide FRom Tran Thanh', // This title already exists in the tasks.data.ts
      completed: false,
    };

    expect(() => service.create(dto))
      .toThrow(ConflictException);
  });
});
