// Mock the database module
jest.mock('./database.js', () => ({
  prisma: {
    task: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

import * as taskService from './task.service.js';
import db from './database.js';

describe('TaskService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all tasks with filters', async () => {
      // Arrange
      const mockTasks = [
        {
          id: 1,
          title: 'Task 1',
          status: 'pending',
          priority: 'high',
          assignee: { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
          project: { id: 1, name: 'Project 1', status: 'active' },
        },
      ];
      const filters = { status: 'pending' };
      db.prisma.task.findMany.mockResolvedValue(mockTasks);

      // Act
      const result = await taskService.findAll(filters);

      // Assert
      expect(result).toEqual(mockTasks);
      expect(db.prisma.task.findMany).toHaveBeenCalledWith({
        where: filters,
        include: {
          assignee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          project: {
            select: {
              id: true,
              name: true,
              status: true,
            },
          },
        },
        orderBy: [
          { priority: 'desc' },
          { dueDate: 'asc' },
          { createdAt: 'desc' },
        ],
      });
    });

    it('should return all tasks without filters', async () => {
      // Arrange
      const mockTasks = [];
      db.prisma.task.findMany.mockResolvedValue(mockTasks);

      // Act
      const result = await taskService.findAll();

      // Assert
      expect(result).toEqual(mockTasks);
      expect(db.prisma.task.findMany).toHaveBeenCalledWith({
        where: {},
        include: expect.any(Object),
        orderBy: expect.any(Array),
      });
    });
  });

  describe('findById', () => {
    it('should return a task by id', async () => {
      // Arrange
      const mockTask = {
        id: 1,
        title: 'Task 1',
        status: 'pending',
        assignee: { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
        project: { id: 1, name: 'Project 1', description: 'Description', status: 'active' },
      };
      db.prisma.task.findUnique.mockResolvedValue(mockTask);

      // Act
      const result = await taskService.findById(1);

      // Assert
      expect(result).toEqual(mockTask);
      expect(db.prisma.task.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: expect.any(Object),
      });
    });
  });

  describe('create', () => {
    it('should create a new task', async () => {
      // Arrange
      const taskData = {
        title: 'New Task',
        description: 'Task description',
        status: 'pending',
        priority: 'medium',
        assigneeId: 1,
        projectId: 1,
      };
      const mockCreatedTask = { id: 1, ...taskData };
      db.prisma.task.create.mockResolvedValue(mockCreatedTask);

      // Act
      const result = await taskService.create(taskData);

      // Assert
      expect(result).toEqual(mockCreatedTask);
      expect(db.prisma.task.create).toHaveBeenCalledWith({
        data: taskData,
        include: expect.any(Object),
      });
    });
  });

  describe('update', () => {
    it('should update an existing task', async () => {
      // Arrange
      const id = 1;
      const updateData = { status: 'completed' };
      const mockUpdatedTask = { id, ...updateData };
      db.prisma.task.update.mockResolvedValue(mockUpdatedTask);

      // Act
      const result = await taskService.update(id, updateData);

      // Assert
      expect(result).toEqual(mockUpdatedTask);
      expect(db.prisma.task.update).toHaveBeenCalledWith({
        where: { id },
        data: updateData,
        include: expect.any(Object),
      });
    });

    it('should return null when task not found', async () => {
      // Arrange
      const error = new Error('Record not found');
      error.code = 'P2025';
      db.prisma.task.update.mockRejectedValue(error);

      // Act
      const result = await taskService.update(999, { status: 'completed' });

      // Assert
      expect(result).toBeNull();
    });

    it('should throw error for other database errors', async () => {
      // Arrange
      const error = new Error('Database error');
      db.prisma.task.update.mockRejectedValue(error);

      // Act & Assert
      await expect(taskService.update(1, { status: 'completed' })).rejects.toThrow('Database error');
    });
  });

  describe('remove', () => {
    it('should delete a task', async () => {
      // Arrange
      db.prisma.task.delete.mockResolvedValue({});

      // Act
      const result = await taskService.remove(1);

      // Assert
      expect(result).toBe(true);
      expect(db.prisma.task.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should return false when task not found', async () => {
      // Arrange
      const error = new Error('Record not found');
      error.code = 'P2025';
      db.prisma.task.delete.mockRejectedValue(error);

      // Act
      const result = await taskService.remove(999);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('updateStatus', () => {
    it('should update task status', async () => {
      // Arrange
      const mockUpdatedTask = { id: 1, status: 'completed' };
      db.prisma.task.update.mockResolvedValue(mockUpdatedTask);

      // Act
      const result = await taskService.updateStatus(1, 'completed');

      // Assert
      expect(result).toEqual(mockUpdatedTask);
      expect(db.prisma.task.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { status: 'completed' },
        include: expect.any(Object),
      });
    });

    it('should return null when task not found', async () => {
      // Arrange
      const error = new Error('Record not found');
      error.code = 'P2025';
      db.prisma.task.update.mockRejectedValue(error);

      // Act
      const result = await taskService.updateStatus(999, 'completed');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('findByProject', () => {
    it('should return tasks by project id', async () => {
      // Arrange
      const mockTasks = [{ id: 1, title: 'Task 1', projectId: 1 }];
      db.prisma.task.findMany.mockResolvedValue(mockTasks);

      // Act
      const result = await taskService.findByProject(1);

      // Assert
      expect(result).toEqual(mockTasks);
      expect(db.prisma.task.findMany).toHaveBeenCalledWith({
        where: { projectId: 1 },
        include: {
          assignee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: [
          { priority: 'desc' },
          { dueDate: 'asc' },
        ],
      });
    });
  });

  describe('findByAssignee', () => {
    it('should return tasks by assignee id', async () => {
      // Arrange
      const mockTasks = [{ id: 1, title: 'Task 1', assigneeId: 1 }];
      db.prisma.task.findMany.mockResolvedValue(mockTasks);

      // Act
      const result = await taskService.findByAssignee(1);

      // Assert
      expect(result).toEqual(mockTasks);
      expect(db.prisma.task.findMany).toHaveBeenCalledWith({
        where: { assigneeId: 1 },
        include: {
          project: {
            select: {
              id: true,
              name: true,
              status: true,
            },
          },
        },
        orderBy: [
          { priority: 'desc' },
          { dueDate: 'asc' },
        ],
      });
    });
  });
});
