import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, Put, ParseIntPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { PutUpdateTaskDto, PatchUpdateTaskDto } from './dto/update-task.dto';
import { GetTasksQueryDto } from './dto/query-task.dto';
import { ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({
    summary: "Api create"
  })
  @ApiCreatedResponse({
    description: 'Task created successfully',
    type: CreateTaskDto
  })
  @ApiConflictResponse({
    description: 'Task already exits'
  })
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all tasks',
  })
  @ApiOkResponse({
    description: 'Task retrieved successfully',
    type: GetTasksQueryDto
  }
  )
  findAll(@Query() query: GetTasksQueryDto){
    return this.tasksService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get task on iD',
  })
  @ApiOkResponse({
    description: 'Task found successfully',
    type: GetTasksQueryDto
  })
  @ApiNotFoundResponse({
    description: 'Task not found',
  })
  findOne(@Param('id',ParseIntPipe) id: number) {
    return this.tasksService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({
    summary: "Full updated on iD"
  })
  @ApiOkResponse({
    description: 'Task updated successfully',
    type: PutUpdateTaskDto,
  })
  @ApiNotFoundResponse({
    description: 'Task not found or task has been deleted',
  })
  PUTupdate(@Param('id') id: number, @Body() putupdateTaskDto: PutUpdateTaskDto){
    return this.tasksService.PUTupdate(+id, putupdateTaskDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: "Updated task on iD"
  })
  @ApiOkResponse({
    description: 'Task updated successfully',
    type: PutUpdateTaskDto,
  })
  @ApiNotFoundResponse({
    description: 'Task not found or task has been deleted',
  })
  PATCHupdate(@Param('id') id: number, @Body() patchupdateTaskDto: PatchUpdateTaskDto) {
    return this.tasksService.PATCHupdate(+id, patchupdateTaskDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: "Deleted task on iD"
  })
  @ApiOkResponse({
    description: 'Task deleted successfully',
  })
  @ApiNotFoundResponse({
  description: 'Task not found or task has already been deleted',
  })
  remove(@Param('id') id: number) {
    return this.tasksService.remove(+id);
  }
}
