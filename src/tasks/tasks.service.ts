import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { PutUpdateTaskDto,PatchUpdateTaskDto } from './dto/update-task.dto';
import { tasks } from './tasks.data';
import { GetTasksQueryDto } from './dto/query-task.dto';

@Injectable()
export class TasksService { 
  //Suport function
  find_Duplicate(taskdto){
    return tasks.find(task=>task.title.trim().toLowerCase() === taskdto.title?.trim().toLowerCase())
  }

  find_ID(id){
    return tasks.find(i => i.id==id)
  }

  //POST /tasks
  create(createTaskDto: CreateTaskDto) {
    
    if(createTaskDto.title !== undefined){
      if(typeof createTaskDto.title !== 'string' || createTaskDto.title.trim().length < 1 || createTaskDto.title.trim().length > 100){
        throw new BadRequestException('Title is a string and > 1 < 100')
      }

      if(typeof createTaskDto.completed !== 'boolean'){
        throw new BadRequestException('Completed must be boolean')
      }
      const duplicate = this.find_Duplicate(createTaskDto)
      if(duplicate){
        throw new ConflictException('Task with this title already exists')
      }
      

      let nextID = tasks.length
      const new_Data = {
        id: nextID++,
        title: createTaskDto.title.trim(),
        completed: createTaskDto.completed ?? false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null
      }

      tasks.push(new_Data);
      return new_Data
    }
    else {
      throw new BadRequestException('Title is required')
    }
  }

  //GET /tasks
  findAll(query: GetTasksQueryDto) {
    let result = tasks;

    //Exclude deletedAt !== null
    result = result.filter(task=> task.deletedAt == null)
     
    //Filter
    if(query.completed !== undefined){
      if(typeof query.completed !== 'boolean'){
        throw new BadRequestException('Completed must be boolean')
      }
      result = result.filter(task=> task.completed === query.completed)
    }    

    //Search
    const search = query.search
    if(search!== undefined){
      if(typeof search !== 'string' || search.trim() === ''){
        throw new BadRequestException('Search must be a non-empty string')
      }
      result = result.filter(task=> task.title.toLowerCase().includes(search.toLowerCase()))
    }

    //Sorting
    if(query.sortBy !== undefined && query.sortOrder !== undefined){
      if(typeof query.sortBy !== 'string' || !['createdAt','title','id'].includes(query.sortBy)){
        throw new BadRequestException('sortBy must be one of createdAt, title, id')
      }
      const sortBy = query.sortBy ?? 'createdAt'
      const sortOrder = query.sortOrder  ?? 'desc'
    
      result.sort((a,b)=> {
        const valueA = a[sortBy];
        const valueB = b[sortBy];

        if(valueA>valueB){
          return sortOrder === 'desc' ? 1: -1
        }

        if(valueA<valueB){
          return sortOrder === 'asc' ? -1: 1
        }

        return 0;
      });
    }
    //Pagination
    if(query.page !== undefined && query.limit !== undefined){
      if(typeof query.page !== 'number' || query.page < 1){
      throw new BadRequestException('Page must be a number greater than 0')
      }
      if(typeof query.limit !== 'number' || query.limit < 1 || query.limit > 100){
      throw new BadRequestException('Limit must be a number between 1 and 100')
      }
      const page = query.page
      const limit = query.limit

      const total = tasks.length
      const totalPages = Math.ceil(total/limit)

      const start = (page -1)*limit;
      const end = start + limit;
      const data = result.slice(start,end)
    
      return {
        data,
        meta:{
          page,
          limit,
          total,
          totalPages
        }
      };
    }
    
    return result;
  }

  //GET /tasks/:id
  findOne(id: number) {
    const result = tasks.find(i=> i.id == id)

    if(!result || result.deletedAt !== null){
      throw new NotFoundException('Task not found')
    }
    return result;
  }

  //PUT /tasks/:id
  PUTupdate(id: number, putupdateTaskDto: PutUpdateTaskDto) {
    if(putupdateTaskDto.title == undefined || putupdateTaskDto.completed == undefined){
      throw new BadRequestException('Missing title or completed')
    }

    const task = this.find_ID(id)
    if(!task || task.deletedAt !== null){
      throw new NotFoundException('Task not found')
    }

    if(this.find_Duplicate(putupdateTaskDto)){
        throw new ConflictException('Task with this title already exists')
    }

    task.title = putupdateTaskDto.title.trim()
    task.completed = putupdateTaskDto.completed
    task.updatedAt = new Date().toISOString()
    return task
  }

  //PATCH /tasks/:id
  PATCHupdate(id: number, patchupdateTaskDto: PatchUpdateTaskDto) {
    if(patchupdateTaskDto.title == undefined && patchupdateTaskDto.completed == undefined){
      throw new BadRequestException('Missing title or completed')
    }

    const task = this.find_ID(id)
    if(!task || task.deletedAt !== null){
      throw new NotFoundException('Task not found')
    }

    if(patchupdateTaskDto.title !== undefined){
      if(this.find_Duplicate(patchupdateTaskDto)){
        throw new ConflictException('Task with this title already exists')
      }
      task.title= patchupdateTaskDto.title.trim()
    }

    if(patchupdateTaskDto.completed !== undefined){
      task.completed = patchupdateTaskDto.completed
    }
    
    task.updatedAt = new Date().toISOString()

    return task
  }

  remove(id: number) {
    const task = this.find_ID(id)
    
    if(!task || task.deletedAt !== null){
      throw new NotFoundException('Task not found')
    }

    task.deletedAt = new Date().toISOString()

    return {
      "message": "Task deleted"
    }
  }
}
