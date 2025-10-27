// Mock the database module
jest.mock('./database.js', () => ({
  prisma: {
    project: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    projectMember: {
      create: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
    task: {
      deleteMany: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

import * as projectService from './project.service.js';
import db from './database.js';

describe('ProjectService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all projects with filters', async () => {
      // Arrange
      const mockProjects = [
        {
          id: 1,
          name: 'Project 1',
          status: 'active',
          members: [],
          tasks: [],
          _count: { tasks: 0, members: 0 },
        },
      ];
      const filters = { status: 'active' };
      db.prisma.project.findMany.mockResolvedValue(mockProjects);

      // Act
      const result = await projectService.findAll(filters);

      // Assert
      expect(result).toEqual(mockProjects);
      expect(db.prisma.project.findMany).toHaveBeenCalledWith({
        where: filters,
        include: expect.any(Object),
        orderBy: {
          createdAt: 'desc',
        },
      });
    });
  });

  describe('findById', () => {
    it('should return a project by id', async () => {
      // Arrange
      const mockProject = {
        id: 1,
        name: 'Project 1',
        members: [],
        tasks: [],
      };
      db.prisma.project.findUnique.mockResolvedValue(mockProject);

      // Act
      const result = await projectService.findById(1);

      // Assert
      expect(result).toEqual(mockProject);
      expect(db.prisma.project.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: expect.any(Object),
      });
    });
  });

  describe('create', () => {
    it('should create a new project', async () => {
      // Arrange
      const projectData = {
        name: 'New Project',
        description: 'Project description',
        status: 'active',
      };
      const mockCreatedProject = { id: 1, ...projectData };
      db.prisma.project.create.mockResolvedValue(mockCreatedProject);

      // Act
      const result = await projectService.create(projectData);

      // Assert
      expect(result).toEqual(mockCreatedProject);
      expect(db.prisma.project.create).toHaveBeenCalledWith({
        data: projectData,
        include: expect.any(Object),
      });
    });
  });

  describe('update', () => {
    it('should update an existing project', async () => {
      // Arrange
      const id = 1;
      const updateData = { status: 'completed' };
      const mockUpdatedProject = { id, ...updateData };
      db.prisma.project.update.mockResolvedValue(mockUpdatedProject);

      // Act
      const result = await projectService.update(id, updateData);

      // Assert
      expect(result).toEqual(mockUpdatedProject);
      expect(db.prisma.project.update).toHaveBeenCalledWith({
        where: { id },
        data: updateData,
        include: expect.any(Object),
      });
    });

    it('should return null when project not found', async () => {
      // Arrange
      const error = new Error('Record not found');
      error.code = 'P2025';
      db.prisma.project.update.mockRejectedValue(error);

      // Act
      const result = await projectService.update(999, { status: 'completed' });

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should delete a project and related records', async () => {
      // Arrange
      const mockTransaction = jest.fn().mockResolvedValue([{}, {}, {}]);
      db.prisma.$transaction.mockImplementation(mockTransaction);

      // Act
      const result = await projectService.remove(1);

      // Assert
      expect(result).toBe(true);
      expect(db.prisma.$transaction).toHaveBeenCalledWith([
        db.prisma.task.deleteMany({ where: { projectId: 1 } }),
        db.prisma.projectMember.deleteMany({ where: { projectId: 1 } }),
        db.prisma.project.delete({ where: { id: 1 } }),
      ]);
    });

    it('should return false when project not found', async () => {
      // Arrange
      const error = new Error('Record not found');
      error.code = 'P2025';
      db.prisma.$transaction.mockRejectedValue(error);

      // Act
      const result = await projectService.remove(999);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('addMember', () => {
    it('should add a member to a project', async () => {
      // Arrange
      const projectId = 1;
      const memberData = { contactId: 1, role: 'developer' };
      const mockMember = { id: 1, projectId, ...memberData };
      db.prisma.projectMember.create.mockResolvedValue(mockMember);

      // Act
      const result = await projectService.addMember(projectId, memberData);

      // Assert
      expect(result).toEqual(mockMember);
      expect(db.prisma.projectMember.create).toHaveBeenCalledWith({
        data: {
          projectId,
          ...memberData,
        },
        include: expect.any(Object),
      });
    });
  });

  describe('getMembers', () => {
    it('should return project members', async () => {
      // Arrange
      const mockMembers = [
        {
          id: 1,
          contact: { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
        },
      ];
      db.prisma.projectMember.findMany.mockResolvedValue(mockMembers);

      // Act
      const result = await projectService.getMembers(1);

      // Assert
      expect(result).toEqual(mockMembers);
      expect(db.prisma.projectMember.findMany).toHaveBeenCalledWith({
        where: { projectId: 1 },
        include: expect.any(Object),
        orderBy: {
          joinedAt: 'asc',
        },
      });
    });
  });

  describe('removeMember', () => {
    it('should remove a member from a project', async () => {
      // Arrange
      db.prisma.projectMember.delete.mockResolvedValue({});

      // Act
      const result = await projectService.removeMember(1, 1);

      // Assert
      expect(result).toBe(true);
      expect(db.prisma.projectMember.delete).toHaveBeenCalledWith({
        where: {
          contactId_projectId: {
            contactId: 1,
            projectId: 1,
          },
        },
      });
    });

    it('should return false when member not found', async () => {
      // Arrange
      const error = new Error('Record not found');
      error.code = 'P2025';
      db.prisma.projectMember.delete.mockRejectedValue(error);

      // Act
      const result = await projectService.removeMember(1, 999);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('getProjectStats', () => {
    it('should return project statistics', async () => {
      // Arrange
      const mockStats = {
        _count: { tasks: 5, members: 3 },
        tasks: [
          { status: 'pending' },
          { status: 'completed' },
          { status: 'pending' },
          { status: 'in_progress' },
          { status: 'completed' },
        ],
      };
      db.prisma.project.findUnique.mockResolvedValue(mockStats);

      // Act
      const result = await projectService.getProjectStats(1);

      // Assert
      expect(result).toEqual({
        totalTasks: 5,
        totalMembers: 3,
        tasksByStatus: {
          pending: 2,
          completed: 2,
          in_progress: 1,
        },
      });
    });

    it('should return null when project not found', async () => {
      // Arrange
      db.prisma.project.findUnique.mockResolvedValue(null);

      // Act
      const result = await projectService.getProjectStats(999);

      // Assert
      expect(result).toBeNull();
    });
  });
});
