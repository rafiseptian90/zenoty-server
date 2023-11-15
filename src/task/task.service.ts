import { Injectable, NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TaskService {
  private readonly logger = new Logger('zenoty-server')

  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    try {
      const newTask = await this.taskRepository.save(createTaskDto)

      this.logger.log(`New task with title '${createTaskDto.title}' has been created`)

      return newTask
    } catch (error) {
      this.logger.error(error)

      throw new InternalServerErrorException('Something went wrong happen in our server')
    }
  }

  async findAll() {
    return await this.taskRepository.find();
  }

  async findOne(id: number) {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      this.logger.log(`Task with ID ${id} not found!`)
      throw new NotFoundException(`Task with ID ${id} not found!`)
    }

    return task
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      this.logger.log(`Task with ID ${id} not found!`)
      throw new NotFoundException(`Task with ID ${id} not found!`)
    }

    try {
      const updatedTask = await this.taskRepository.save(Object.assign(task, updateTaskDto))

      this.logger.log(`Task with ID ${id} has been updated`)

      return updatedTask
    } catch (error) {
      this.logger.error(error)

      throw new InternalServerErrorException('Something went wrong happen in our server')
    }
  }

  async remove(id: number) {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found!`)
    }

    try {
      const deletedTask = await this.taskRepository.delete(id)

      this.logger.log(`Task with ID ${id} has been deleted`)

      return deletedTask
    } catch (error) {
      this.logger.error(error)

      throw new InternalServerErrorException('Something went wrong happen in our server')
    }
  }
}
