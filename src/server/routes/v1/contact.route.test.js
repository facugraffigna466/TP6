/**
 * @jest-environment node
 */

import request from 'supertest';
import express from 'express';
import { errors } from 'celebrate';
import contactRoutes from '../v1/contact.route.js';
import contactService from '../../services/contact.service.js';

var mockContactService;

jest.mock('../../services/contact.service.js', () => {
  mockContactService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  return {
    __esModule: true,
    default: mockContactService,
  };
});

// Create Express app for testing
const app = express();
app.use(express.json());
app.use('/api/contacts', contactRoutes);
app.use(errors());
app.use((err, req, res, _next) => {
  if (err && (err.joi || err.details)) {
    return res.status(err.statusCode || 400).json({
      success: false,
      data: null,
      message: err.message,
      timestamp: new Date().toISOString(),
    });
  }
  if (err && err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      data: null,
      message: 'Invalid JSON payload',
      timestamp: new Date().toISOString(),
    });
  }
  return res.status(err.statusCode || 500).json({
    success: false,
    data: null,
    message: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString(),
  });
});

describe('Contact Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/contacts/list', () => {
    it('should return all contacts', async () => {
      // Arrange
      const mockContacts = [
        { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
        { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
      ];
      contactService.findAll.mockResolvedValue(mockContacts);

      // Act
      const response = await request(app)
        .get('/api/contacts/list')
        .expect(200);

      // Assert
      expect(response.body).toEqual({
        success: true,
        data: mockContacts,
        message: 'Success',
        timestamp: expect.any(String),
      });
      expect(contactService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should handle service errors', async () => {
      // Arrange
      contactService.findAll.mockRejectedValue(new Error('Database error'));

      // Act
      const response = await request(app)
        .get('/api/contacts/list')
        .expect(500);

      // Assert
      expect(response.body).toEqual({
        success: false,
        data: null,
        message: 'Failed to retrieve contacts',
        timestamp: expect.any(String),
      });
    });
  });

  describe('GET /api/contacts/:id', () => {
    it('should return a contact by id', async () => {
      // Arrange
      const mockContact = { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com' };
      contactService.findById.mockResolvedValue(mockContact);

      // Act
      const response = await request(app)
        .get('/api/contacts/1')
        .expect(200);

      // Assert
      expect(response.body).toEqual({
        success: true,
        data: mockContact,
        message: 'Success',
        timestamp: expect.any(String),
      });
      expect(contactService.findById).toHaveBeenCalledWith('1');
    });

    it('should return 404 when contact not found', async () => {
      // Arrange
      contactService.findById.mockResolvedValue(null);

      // Act
      const response = await request(app)
        .get('/api/contacts/999')
        .expect(404);

      // Assert
      expect(response.body).toEqual({
        success: false,
        data: null,
        message: 'Contact not found',
        timestamp: expect.any(String),
      });
    });

    it('should handle service errors', async () => {
      // Arrange
      contactService.findById.mockRejectedValue(new Error('Database error'));

      // Act
      const response = await request(app)
        .get('/api/contacts/1')
        .expect(500);

      // Assert
      expect(response.body).toEqual({
        success: false,
        data: null,
        message: 'Failed to retrieve contact',
        timestamp: expect.any(String),
      });
    });
  });

  describe('POST /api/contacts', () => {
    it('should create a new contact', async () => {
      // Arrange
      const contactData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      };
      const mockCreatedContact = { id: 1, ...contactData };
      contactService.create.mockResolvedValue(mockCreatedContact);

      // Act
      const response = await request(app)
        .post('/api/contacts')
        .send(contactData)
        .expect(201);

      // Assert
      expect(response.body).toEqual({
        success: true,
        data: mockCreatedContact,
        message: 'Success',
        timestamp: expect.any(String),
      });
      expect(contactService.create).toHaveBeenCalledWith(contactData);
    });

    it('should handle service errors', async () => {
      // Arrange
      const contactData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      };
      contactService.create.mockRejectedValue(new Error('Email already exists'));

      // Act
      const response = await request(app)
        .post('/api/contacts')
        .send(contactData)
        .expect(500);

      // Assert
      expect(response.body).toEqual({
        success: false,
        data: null,
        message: 'Failed to create contact',
        timestamp: expect.any(String),
      });
    });
  });

  describe('PUT /api/contacts/:id', () => {
    it('should update an existing contact', async () => {
      // Arrange
      const updateData = {
        firstName: 'Johnny',
        lastName: 'Doe',
        email: 'johnny@example.com',
      };
      const mockUpdatedContact = { id: 1, ...updateData };
      contactService.update.mockResolvedValue(mockUpdatedContact);

      // Act
      const response = await request(app)
        .put('/api/contacts/1')
        .send(updateData)
        .expect(200);

      // Assert
      expect(response.body).toEqual({
        success: true,
        data: mockUpdatedContact,
        message: 'Success',
        timestamp: expect.any(String),
      });
      expect(contactService.update).toHaveBeenCalledWith(1, updateData);
    });

    it('should handle service errors', async () => {
      // Arrange
      const updateData = { firstName: 'Johnny' };
      contactService.update.mockRejectedValue(new Error('Contact not found'));

      // Act
      const response = await request(app)
        .put('/api/contacts/1')
        .send(updateData)
        .expect(500);

      // Assert
      expect(response.body).toEqual({
        success: false,
        data: null,
        message: 'Failed to update contact',
        timestamp: expect.any(String),
      });
    });
  });

  describe('DELETE /api/contacts/:id', () => {
    it('should delete a contact', async () => {
      // Arrange
      const mockDeletedContact = { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com' };
      contactService.delete.mockResolvedValue(mockDeletedContact);

      // Act
      const response = await request(app)
        .delete('/api/contacts/1')
        .expect(200);

      // Assert
      expect(response.body).toEqual({
        success: true,
        data: mockDeletedContact,
        message: 'Success',
        timestamp: expect.any(String),
      });
      expect(contactService.delete).toHaveBeenCalledWith(1);
    });

    it('should handle service errors', async () => {
      // Arrange
      contactService.delete.mockRejectedValue(new Error('Contact not found'));

      // Act
      const response = await request(app)
        .delete('/api/contacts/1')
        .expect(500);

      // Assert
      expect(response.body).toEqual({
        success: false,
        data: null,
        message: 'Failed to delete contact',
        timestamp: expect.any(String),
      });
    });
  });
});
