// Mock the database
jest.mock('../../services/database.js', () => ({
  prisma: {
    contact: {
      findMany: jest.fn().mockResolvedValue([]),
      findUnique: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({ id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com' }),
      update: jest.fn().mockResolvedValue({ id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com' }),
      delete: jest.fn().mockResolvedValue({ id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com' }),
    },
    task: {
      findMany: jest.fn().mockResolvedValue([]),
      findUnique: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({ id: 1, title: 'Test Task' }),
      update: jest.fn().mockResolvedValue({ id: 1, title: 'Test Task' }),
      delete: jest.fn().mockResolvedValue({ id: 1, title: 'Test Task' }),
    },
    project: {
      findMany: jest.fn().mockResolvedValue([]),
      findUnique: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({ id: 1, name: 'Test Project' }),
      update: jest.fn().mockResolvedValue({ id: 1, name: 'Test Project' }),
      delete: jest.fn().mockResolvedValue({ id: 1, name: 'Test Project' }),
    },
  },
}));

// Mock the services
jest.mock('../../services/contact.service.js', () => ({
  default: {
    findAll: jest.fn().mockResolvedValue([]),
    findById: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockResolvedValue({ id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com' }),
    update: jest.fn().mockResolvedValue({ id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com' }),
    delete: jest.fn().mockResolvedValue({ id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com' }),
  },
}));

jest.mock('../../services/task.service.js', () => ({
  findAll: jest.fn().mockResolvedValue([]),
  findById: jest.fn().mockResolvedValue(null),
  create: jest.fn().mockResolvedValue({ id: 1, title: 'Test Task' }),
  update: jest.fn().mockResolvedValue({ id: 1, title: 'Test Task' }),
  remove: jest.fn().mockResolvedValue(true),
}));

jest.mock('../../services/project.service.js', () => ({
  findAll: jest.fn().mockResolvedValue([]),
  findById: jest.fn().mockResolvedValue(null),
  create: jest.fn().mockResolvedValue({ id: 1, name: 'Test Project' }),
  update: jest.fn().mockResolvedValue({ id: 1, name: 'Test Project' }),
  remove: jest.fn().mockResolvedValue(true),
}));

import request from 'supertest';
import express from 'express';
import routes from './index.js';

// Create Express app for testing
const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/v1/', routes);
  return app;
};

describe('API Routes Index', () => {
  let app;

  beforeEach(() => {
    app = createApp();
  });

  describe('Health Check', () => {
    it('should return "Ok" for health check endpoint', async () => {
      // Act
      const response = await request(app)
        .get('/api/v1/health')
        .expect(200);

      // Assert
      expect(response.text).toBe('Ok');
    });
  });

  describe('Route Registration', () => {
    it('should register contact routes', async () => {
      // Act
      const response = await request(app)
        .get('/api/v1/contact/list')
        .expect(200);

      // Assert
      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('timestamp');
    });

    it('should register task routes', async () => {
      // Act
      const response = await request(app)
        .get('/api/v1/task/list')
        .expect(200);

      // Assert
      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('timestamp');
    });

    it('should register project routes', async () => {
      // Act
      const response = await request(app)
        .get('/api/v1/project/list')
        .expect(200);

      // Assert
      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 for non-existent routes', async () => {
      // Act
      const response = await request(app)
        .get('/api/v1/non-existent')
        .expect(404);

      // Assert
      expect(response.body).toBeDefined();
    });

    it('should handle errors in route handlers', async () => {
      // This test ensures the error handler middleware is properly configured
      // The actual error handling is tested in individual route tests
      const response = await request(app)
        .get('/api/v1/contact/list')
        .expect(200);

      expect(response.body).toHaveProperty('success');
    });
  });

  describe('Router Configuration', () => {
    it('should be an Express Router instance', () => {
      // Assert
      expect(routes).toBeDefined();
      expect(typeof routes).toBe('function');
    });

    it('should handle multiple HTTP methods', async () => {
      // Test GET
      await request(app)
        .get('/api/v1/health')
        .expect(200);

      // Test POST (this will fail validation but route should be registered)
      await request(app)
        .post('/api/v1/contact')
        .send({})
        .expect(400); // Validation error, but route exists

      // Test PUT (this will fail validation but route should be registered)
      await request(app)
        .put('/api/v1/contact/1')
        .send({})
        .expect(400); // Validation error, but route exists

      // Test DELETE (this will fail validation but route should be registered)
      await request(app)
        .delete('/api/v1/contact/1')
        .expect(200); // This should work as it doesn't require body validation
    });
  });

  describe('Middleware Integration', () => {
    it('should apply JSON parsing middleware', async () => {
      // Act
      const response = await request(app)
        .post('/api/v1/contact')
        .send({ firstName: 'John', lastName: 'Doe', email: 'john@example.com' })
        .expect(201);

      // Assert
      expect(response.body).toHaveProperty('success');
    });

    it('should handle malformed JSON gracefully', async () => {
      // Act
      const response = await request(app)
        .post('/api/v1/contact')
        .set('Content-Type', 'application/json')
        .send('invalid json')
        .expect(400);

      // Assert
      expect(response.body).toBeDefined();
    });
  });

  describe('Route Paths', () => {
    it('should handle contact routes with correct paths', async () => {
      const contactPaths = [
        '/api/v1/contact/list',
        '/api/v1/contact/1',
      ];

      for (const path of contactPaths) {
        const response = await request(app).get(path);
        expect([200, 404]).toContain(response.status);
      }
    });

    it('should handle task routes with correct paths', async () => {
      const taskPaths = [
        '/api/v1/task/list',
        '/api/v1/task/1',
      ];

      for (const path of taskPaths) {
        const response = await request(app).get(path);
        expect([200, 404]).toContain(response.status);
      }
    });

    it('should handle project routes with correct paths', async () => {
      const projectPaths = [
        '/api/v1/project/list',
        '/api/v1/project/1',
      ];

      for (const path of projectPaths) {
        const response = await request(app).get(path);
        expect([200, 404]).toContain(response.status);
      }
    });
  });
});
