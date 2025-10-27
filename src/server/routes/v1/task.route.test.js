import request from 'supertest';
import express from 'express';
import taskRoutes from '../v1/task.route.js';
import * as taskService from '../../services/task.service.js';

// Mock the task service
jest.mock('../../services/task.service.js', () => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  updateStatus: jest.fn(),
}));

// Create Express app for testing
const app = express();
app.use(express.json());
app.use('/api/tasks', taskRoutes);

describe('Task Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/tasks/list', () => {
    it('should return all tasks without filters', async () => {
      // Arrange
      const mockTasks = [
        { id: 1, title: 'Task 1', status: 'TODO', priority: 'MEDIUM' },
        { id: 2, title: 'Task 2', status: 'IN_PROGRESS', priority: 'HIGH' },
      ];
      taskService.findAll.mockResolvedValue(mockTasks);

      // Act
      const response = await request(app)
        .get('/api/tasks/list')
        .expect(200);

      // Assert
      expect(response.body).toEqual({
        success: true,
        data: mockTasks,
        message: 'Tasks retrieved successfully',
        timestamp: expect.any(String),
      });
      expect(taskService.findAll).toHaveBeenCalledWith({});
    });

    it('should return tasks with filters', async () => {
      // Arrange
      const mockTasks = [{ id: 1, title: 'Task 1', status: 'TODO' }];
      taskService.findAll.mockResolvedValue(mockTasks);

      // Act
      const response = await request(app)
        .get('/api/tasks/list?status=TODO&priority=HIGH&assigneeId=1&projectId=1')
        .expect(200);

      // Assert
      expect(response.body.success).toBe(true);
      expect(taskService.findAll).toHaveBeenCalledWith({
        status: 'TODO',
        priority: 'HIGH',
        assigneeId: 1,
        projectId: 1,
      });
    });

    it('should handle service errors', async () => {
      // Arrange
      taskService.findAll.mockRejectedValue(new Error('Database error'));

      // Act
      const response = await request(app)
        .get('/api/tasks/list')
        .expect(500);

      // Assert
      expect(response.body).toEqual({
        success: false,
        data: null,
        message: 'Failed to fetch tasks',
        timestamp: expect.any(String),
      });
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should return a task by id', async () => {
      // Arrange
      const mockTask = { id: 1, title: 'Task 1', status: 'TODO' };
      taskService.findById.mockResolvedValue(mockTask);

      // Act
      const response = await request(app)
        .get('/api/tasks/1')
        .expect(200);

      // Assert
      expect(response.body).toEqual({
        success: true,
        data: mockTask,
        message: 'Task retrieved successfully',
        timestamp: expect.any(String),
      });
      expect(taskService.findById).toHaveBeenCalledWith(1);
    });

    it('should return 404 when task not found', async () => {
      // Arrange
      taskService.findById.mockResolvedValue(null);

      // Act
      const response = await request(app)
        .get('/api/tasks/999')
        .expect(404);

      // Assert
      expect(response.body).toEqual({
        success: false,
        data: null,
        message: 'Task not found',
        timestamp: expect.any(String),
      });
    });

    it('should validate task id parameter', async () => {
      // Act
      const response = await request(app)
        .get('/api/tasks/invalid')
        .expect(400);

      // Assert
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/tasks/create', () => {
    it('should create a new task', async () => {
      // Arrange
      const taskData = {
        title: 'New Task',
        description: 'Task description',
        status: 'TODO',
        priority: 'MEDIUM',
        assigneeId: 1,
        projectId: 1,
      };
      const mockCreatedTask = { id: 1, ...taskData };
      taskService.create.mockResolvedValue(mockCreatedTask);

      // Act
      const response = await request(app)
        .post('/api/tasks/create')
        .send(taskData)
        .expect(201);

      // Assert
      expect(response.body).toEqual({
        success: true,
        data: mockCreatedTask,
        message: 'Task created successfully',
        timestamp: expect.any(String),
      });
      expect(taskService.create).toHaveBeenCalledWith(taskData);
    });

    it('should validate required fields', async () => {
      // Act
      const response = await request(app)
        .post('/api/tasks/create')
        .send({ description: 'Missing title' })
        .expect(400);

      // Assert
      expect(response.body.success).toBe(false);
    });

    it('should handle service errors', async () => {
      // Arrange
      const taskData = { title: 'New Task' };
      taskService.create.mockRejectedValue(new Error('Database error'));

      // Act
      const response = await request(app)
        .post('/api/tasks/create')
        .send(taskData)
        .expect(500);

      // Assert
      expect(response.body).toEqual({
        success: false,
        data: null,
        message: 'Failed to create task',
        timestamp: expect.any(String),
      });
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update an existing task', async () => {
      // Arrange
      const updateData = { status: 'IN_PROGRESS', priority: 'HIGH' };
      const mockUpdatedTask = { id: 1, ...updateData };
      taskService.update.mockResolvedValue(mockUpdatedTask);

      // Act
      const response = await request(app)
        .put('/api/tasks/1')
        .send(updateData)
        .expect(200);

      // Assert
      expect(response.body).toEqual({
        success: true,
        data: mockUpdatedTask,
        message: 'Task updated successfully',
        timestamp: expect.any(String),
      });
      expect(taskService.update).toHaveBeenCalledWith(1, updateData);
    });

    it('should return 404 when task not found', async () => {
      // Arrange
      taskService.update.mockResolvedValue(null);

      // Act
      const response = await request(app)
        .put('/api/tasks/999')
        .send({ status: 'IN_PROGRESS' })
        .expect(404);

      // Assert
      expect(response.body).toEqual({
        success: false,
        data: null,
        message: 'Task not found',
        timestamp: expect.any(String),
      });
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', async () => {
      // Arrange
      taskService.remove.mockResolvedValue(true);

      // Act
      const response = await request(app)
        .delete('/api/tasks/1')
        .expect(200);

      // Assert
      expect(response.body).toEqual({
        success: true,
        data: null,
        message: 'Task deleted successfully',
        timestamp: expect.any(String),
      });
      expect(taskService.remove).toHaveBeenCalledWith(1);
    });

    it('should return 404 when task not found', async () => {
      // Arrange
      taskService.remove.mockResolvedValue(false);

      // Act
      const response = await request(app)
        .delete('/api/tasks/999')
        .expect(404);

      // Assert
      expect(response.body).toEqual({
        success: false,
        data: null,
        message: 'Task not found',
        timestamp: expect.any(String),
      });
    });
  });

  describe('PATCH /api/tasks/:id/status', () => {
    it('should update task status', async () => {
      // Arrange
      const mockUpdatedTask = { id: 1, status: 'DONE' };
      taskService.updateStatus.mockResolvedValue(mockUpdatedTask);

      // Act
      const response = await request(app)
        .patch('/api/tasks/1/status')
        .send({ status: 'DONE' })
        .expect(200);

      // Assert
      expect(response.body).toEqual({
        success: true,
        data: mockUpdatedTask,
        message: 'Task status updated successfully',
        timestamp: expect.any(String),
      });
      expect(taskService.updateStatus).toHaveBeenCalledWith(1, 'DONE');
    });

    it('should return 404 when task not found', async () => {
      // Arrange
      taskService.updateStatus.mockResolvedValue(null);

      // Act
      const response = await request(app)
        .patch('/api/tasks/999/status')
        .send({ status: 'DONE' })
        .expect(404);

      // Assert
      expect(response.body).toEqual({
        success: false,
        data: null,
        message: 'Task not found',
        timestamp: expect.any(String),
      });
    });

    it('should validate status value', async () => {
      // Act
      const response = await request(app)
        .patch('/api/tasks/1/status')
        .send({ status: 'INVALID_STATUS' })
        .expect(400);

      // Assert
      expect(response.body.success).toBe(false);
    });
  });
});
