import request from 'supertest';
import express from 'express';
import projectRoutes from '../v1/project.route.js';
import * as projectService from '../../services/project.service.js';

// Mock the project service
jest.mock('../../services/project.service.js', () => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  addMember: jest.fn(),
  getMembers: jest.fn(),
  removeMember: jest.fn(),
}));

// Create Express app for testing
const app = express();
app.use(express.json());
app.use('/api/projects', projectRoutes);

describe('Project Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/projects/list', () => {
    it('should return all projects without filters', async () => {
      // Arrange
      const mockProjects = [
        { id: 1, name: 'Project 1', status: 'active' },
        { id: 2, name: 'Project 2', status: 'completed' },
      ];
      projectService.findAll.mockResolvedValue(mockProjects);

      // Act
      const response = await request(app)
        .get('/api/projects/list')
        .expect(200);

      // Assert
      expect(response.body).toEqual({
        success: true,
        data: mockProjects,
        message: 'Projects retrieved successfully',
        timestamp: expect.any(String),
      });
      expect(projectService.findAll).toHaveBeenCalledWith({});
    });

    it('should return projects with status filter', async () => {
      // Arrange
      const mockProjects = [{ id: 1, name: 'Project 1', status: 'active' }];
      projectService.findAll.mockResolvedValue(mockProjects);

      // Act
      const response = await request(app)
        .get('/api/projects/list?status=active')
        .expect(200);

      // Assert
      expect(response.body.success).toBe(true);
      expect(projectService.findAll).toHaveBeenCalledWith({ status: 'active' });
    });

    it('should handle service errors', async () => {
      // Arrange
      projectService.findAll.mockRejectedValue(new Error('Database error'));

      // Act
      const response = await request(app)
        .get('/api/projects/list')
        .expect(500);

      // Assert
      expect(response.body).toEqual({
        success: false,
        data: null,
        message: 'Failed to fetch projects',
        timestamp: expect.any(String),
      });
    });
  });

  describe('GET /api/projects/:id', () => {
    it('should return a project by id', async () => {
      // Arrange
      const mockProject = { id: 1, name: 'Project 1', status: 'active' };
      projectService.findById.mockResolvedValue(mockProject);

      // Act
      const response = await request(app)
        .get('/api/projects/1')
        .expect(200);

      // Assert
      expect(response.body).toEqual({
        success: true,
        data: mockProject,
        message: 'Project retrieved successfully',
        timestamp: expect.any(String),
      });
      expect(projectService.findById).toHaveBeenCalledWith(1);
    });

    it('should return 404 when project not found', async () => {
      // Arrange
      projectService.findById.mockResolvedValue(null);

      // Act
      const response = await request(app)
        .get('/api/projects/999')
        .expect(404);

      // Assert
      expect(response.body).toEqual({
        success: false,
        data: null,
        message: 'Project not found',
        timestamp: expect.any(String),
      });
    });

    it('should validate project id parameter', async () => {
      // Act
      const response = await request(app)
        .get('/api/projects/invalid')
        .expect(400);

      // Assert
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/projects/create', () => {
    it('should create a new project', async () => {
      // Arrange
      const projectData = {
        name: 'New Project',
        description: 'Project description',
        status: 'active',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      };
      const mockCreatedProject = { id: 1, ...projectData };
      projectService.create.mockResolvedValue(mockCreatedProject);

      // Act
      const response = await request(app)
        .post('/api/projects/create')
        .send(projectData)
        .expect(201);

      // Assert
      expect(response.body).toEqual({
        success: true,
        data: mockCreatedProject,
        message: 'Project created successfully',
        timestamp: expect.any(String),
      });
      expect(projectService.create).toHaveBeenCalledWith(projectData);
    });

    it('should validate required fields', async () => {
      // Act
      const response = await request(app)
        .post('/api/projects/create')
        .send({ description: 'Missing name' })
        .expect(400);

      // Assert
      expect(response.body.success).toBe(false);
    });

    it('should handle service errors', async () => {
      // Arrange
      const projectData = { name: 'New Project' };
      projectService.create.mockRejectedValue(new Error('Database error'));

      // Act
      const response = await request(app)
        .post('/api/projects/create')
        .send(projectData)
        .expect(500);

      // Assert
      expect(response.body).toEqual({
        success: false,
        data: null,
        message: 'Failed to create project',
        timestamp: expect.any(String),
      });
    });
  });

  describe('PUT /api/projects/:id', () => {
    it('should update an existing project', async () => {
      // Arrange
      const updateData = { status: 'completed', endDate: '2024-12-31' };
      const mockUpdatedProject = { id: 1, ...updateData };
      projectService.update.mockResolvedValue(mockUpdatedProject);

      // Act
      const response = await request(app)
        .put('/api/projects/1')
        .send(updateData)
        .expect(200);

      // Assert
      expect(response.body).toEqual({
        success: true,
        data: mockUpdatedProject,
        message: 'Project updated successfully',
        timestamp: expect.any(String),
      });
      expect(projectService.update).toHaveBeenCalledWith(1, updateData);
    });

    it('should return 404 when project not found', async () => {
      // Arrange
      projectService.update.mockResolvedValue(null);

      // Act
      const response = await request(app)
        .put('/api/projects/999')
        .send({ status: 'completed' })
        .expect(404);

      // Assert
      expect(response.body).toEqual({
        success: false,
        data: null,
        message: 'Project not found',
        timestamp: expect.any(String),
      });
    });
  });

  describe('DELETE /api/projects/:id', () => {
    it('should delete a project', async () => {
      // Arrange
      projectService.remove.mockResolvedValue(true);

      // Act
      const response = await request(app)
        .delete('/api/projects/1')
        .expect(200);

      // Assert
      expect(response.body).toEqual({
        success: true,
        data: null,
        message: 'Project deleted successfully',
        timestamp: expect.any(String),
      });
      expect(projectService.remove).toHaveBeenCalledWith(1);
    });

    it('should return 404 when project not found', async () => {
      // Arrange
      projectService.remove.mockResolvedValue(false);

      // Act
      const response = await request(app)
        .delete('/api/projects/999')
        .expect(404);

      // Assert
      expect(response.body).toEqual({
        success: false,
        data: null,
        message: 'Project not found',
        timestamp: expect.any(String),
      });
    });
  });

  describe('POST /api/projects/:id/members', () => {
    it('should add a member to a project', async () => {
      // Arrange
      const memberData = { contactId: 1, role: 'developer' };
      const mockMember = { id: 1, projectId: 1, ...memberData };
      projectService.addMember.mockResolvedValue(mockMember);

      // Act
      const response = await request(app)
        .post('/api/projects/1/members')
        .send(memberData)
        .expect(201);

      // Assert
      expect(response.body).toEqual({
        success: true,
        data: mockMember,
        message: 'Member added to project successfully',
        timestamp: expect.any(String),
      });
      expect(projectService.addMember).toHaveBeenCalledWith(1, memberData);
    });

    it('should handle duplicate member error', async () => {
      // Arrange
      const memberData = { contactId: 1, role: 'developer' };
      const error = new Error('Duplicate member');
      error.code = 'P2002';
      projectService.addMember.mockRejectedValue(error);

      // Act
      const response = await request(app)
        .post('/api/projects/1/members')
        .send(memberData)
        .expect(400);

      // Assert
      expect(response.body).toEqual({
        success: false,
        data: null,
        message: 'Contact is already a member of this project',
        timestamp: expect.any(String),
      });
    });

    it('should validate required fields', async () => {
      // Act
      const response = await request(app)
        .post('/api/projects/1/members')
        .send({ role: 'developer' })
        .expect(400);

      // Assert
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/projects/:id/members', () => {
    it('should return project members', async () => {
      // Arrange
      const mockMembers = [
        { id: 1, contact: { id: 1, firstName: 'John', lastName: 'Doe' } },
      ];
      projectService.getMembers.mockResolvedValue(mockMembers);

      // Act
      const response = await request(app)
        .get('/api/projects/1/members')
        .expect(200);

      // Assert
      expect(response.body).toEqual({
        success: true,
        data: mockMembers,
        message: 'Project members retrieved successfully',
        timestamp: expect.any(String),
      });
      expect(projectService.getMembers).toHaveBeenCalledWith(1);
    });

    it('should handle service errors', async () => {
      // Arrange
      projectService.getMembers.mockRejectedValue(new Error('Database error'));

      // Act
      const response = await request(app)
        .get('/api/projects/1/members')
        .expect(500);

      // Assert
      expect(response.body).toEqual({
        success: false,
        data: null,
        message: 'Failed to fetch project members',
        timestamp: expect.any(String),
      });
    });
  });

  describe('DELETE /api/projects/:id/members/:contactId', () => {
    it('should remove a member from a project', async () => {
      // Arrange
      projectService.removeMember.mockResolvedValue(true);

      // Act
      const response = await request(app)
        .delete('/api/projects/1/members/1')
        .expect(200);

      // Assert
      expect(response.body).toEqual({
        success: true,
        data: null,
        message: 'Member removed from project successfully',
        timestamp: expect.any(String),
      });
      expect(projectService.removeMember).toHaveBeenCalledWith(1, 1);
    });

    it('should return 404 when member not found', async () => {
      // Arrange
      projectService.removeMember.mockResolvedValue(false);

      // Act
      const response = await request(app)
        .delete('/api/projects/1/members/999')
        .expect(404);

      // Assert
      expect(response.body).toEqual({
        success: false,
        data: null,
        message: 'Member not found in project',
        timestamp: expect.any(String),
      });
    });

    it('should validate parameters', async () => {
      // Act
      const response = await request(app)
        .delete('/api/projects/invalid/members/invalid')
        .expect(400);

      // Assert
      expect(response.body.success).toBe(false);
    });
  });
});
