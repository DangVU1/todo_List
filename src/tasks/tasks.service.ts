import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { PutUpdateTaskDto, PatchUpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../prisma/prisma.service';
import { GetTasksQueryDto } from './dto/query-task.dto';
import {Task} from '@prisma/client'

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) { }

  private toResponse(task: Task) {
    return {
      id: task.id,
      title: task.title,
      completed: task.completed,
    };
  }

  async find_Duplicate(taskdto, id?) {
    const duplicate = await this.prisma.task.findFirst({
      where: {
        deletedAt: null,
        title: { equals: taskdto.title.trim(), mode: 'insensitive' },
        ...(id && { NOT: { id: id } }),
      },
    });
    return duplicate
  }

  async find_Id(id) {
    const task = await this.prisma.task.findFirst({
      where: {
        id,
        deletedAt: null
      }
    })
    return task
  }

  //POST /tasks
  async create(createTaskDto: CreateTaskDto) {
    const duplicate = await this.find_Duplicate(createTaskDto, undefined)

    if (duplicate) {
      throw new ConflictException('Task title already exists');
    }
    return this.prisma.task.create({
      data: {
        title: createTaskDto.title
      }
    })
  }

  //GET /tasks
  async findAll(query: GetTasksQueryDto) {
    const page = query.page ?? 1;
    const sortBy = query.sortBy ?? 'createdAt';
    const sortOrder = query.sortOrder ?? 'desc';
    const limit = query.limit ?? 5;

    const where = {
      deletedAt: null,
      ...(query.completed !== undefined && { completed: query.completed }),
      ...(query.search !== undefined && {
        title: { contains: query.search, mode: 'insensitive' as const },
      }),
    };

    const total = await this.prisma.task.count({ where });

    const data = await this.prisma.task.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: data.map(this.toResponse),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  //GET /tasks/:id
  async findOne(id: number) {
    const task = await this.find_Id(id)

    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task
  }

  //PUT /tasks/:id
  async PUTupdate(id: number, putupdateTaskDto: PutUpdateTaskDto) {
    const task = await this.find_Id(id)
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const duplicate = await this.find_Duplicate(putupdateTaskDto, id)
    if (duplicate) {
      throw new ConflictException('Task with this title already exists')
    }

    return this.prisma.task.update({
      where: {
        id: id
      },
      data: {
        title: putupdateTaskDto.title,
        completed: putupdateTaskDto.completed,
      }
    })
  }

  //PATCH /tasks/:id
  async PATCHupdate(id: number, patchupdateTaskDto: PatchUpdateTaskDto) {
    const task = await this.find_Id(id)
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (patchupdateTaskDto.title !== undefined) {
      const duplicate = await this.find_Duplicate(patchupdateTaskDto, id)
      
      if (duplicate) {
        throw new ConflictException('Task with this title already exists')
      }
    }

    return this.prisma.task.update({
      where: {
        id: id
      },
      data: {
        ...(patchupdateTaskDto.title !== undefined && { title: patchupdateTaskDto.title }),
        ...(patchupdateTaskDto.completed !== undefined && { completed: patchupdateTaskDto.completed }),
      }
    })
  }

  async remove(id: number) {
    const task = await this.find_Id(id)
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.prisma.task.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return {
      "message": "Task deleted"
    }
  }
}
