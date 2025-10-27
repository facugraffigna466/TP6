// Mock the database module
jest.mock('./database.js', () => ({
  prisma: {
    contact: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

import contactService from './contact.service.js';
import db from './database.js';

describe('ContactService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all contacts', async () => {
      // Arrange
      const mockContacts = [
        { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
        { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
      ];
      db.prisma.contact.findMany.mockResolvedValue(mockContacts);

      // Act
      const result = await contactService.findAll();

      // Assert
      expect(result).toEqual(mockContacts);
      expect(db.prisma.contact.findMany).toHaveBeenCalledTimes(1);
      expect(db.prisma.contact.findMany).toHaveBeenCalledWith();
    });

    it('should handle database errors', async () => {
      // Arrange
      const error = new Error('Database connection failed');
      db.prisma.contact.findMany.mockRejectedValue(error);

      // Act & Assert
      await expect(contactService.findAll()).rejects.toThrow('Database connection failed');
      expect(db.prisma.contact.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    it('should return a contact by id', async () => {
      // Arrange
      const mockContact = { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com' };
      db.prisma.contact.findUnique.mockResolvedValue(mockContact);

      // Act
      const result = await contactService.findById(1);

      // Assert
      expect(result).toEqual(mockContact);
      expect(db.prisma.contact.findUnique).toHaveBeenCalledTimes(1);
      expect(db.prisma.contact.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should return null when contact not found', async () => {
      // Arrange
      db.prisma.contact.findUnique.mockResolvedValue(null);

      // Act
      const result = await contactService.findById(999);

      // Assert
      expect(result).toBeNull();
      expect(db.prisma.contact.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
      });
    });

    it('should convert string id to number', async () => {
      // Arrange
      const mockContact = { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com' };
      db.prisma.contact.findUnique.mockResolvedValue(mockContact);

      // Act
      const result = await contactService.findById('1');

      // Assert
      expect(result).toEqual(mockContact);
      expect(db.prisma.contact.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should handle database errors', async () => {
      // Arrange
      const error = new Error('Database error');
      db.prisma.contact.findUnique.mockRejectedValue(error);

      // Act & Assert
      await expect(contactService.findById(1)).rejects.toThrow('Database error');
    });
  });

  describe('create', () => {
    it('should create a new contact', async () => {
      // Arrange
      const contactData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      };
      const mockCreatedContact = { id: 1, ...contactData };
      db.prisma.contact.create.mockResolvedValue(mockCreatedContact);

      // Act
      const result = await contactService.create(contactData);

      // Assert
      expect(result).toEqual(mockCreatedContact);
      expect(db.prisma.contact.create).toHaveBeenCalledTimes(1);
      expect(db.prisma.contact.create).toHaveBeenCalledWith({
        data: contactData,
      });
    });

    it('should handle database errors during creation', async () => {
      // Arrange
      const contactData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      };
      const error = new Error('Email already exists');
      db.prisma.contact.create.mockRejectedValue(error);

      // Act & Assert
      await expect(contactService.create(contactData)).rejects.toThrow('Email already exists');
    });
  });

  describe('update', () => {
    it('should update an existing contact', async () => {
      // Arrange
      const id = 1;
      const updateData = {
        firstName: 'Johnny',
        lastName: 'Doe',
        email: 'johnny@example.com',
      };
      const mockUpdatedContact = { id, ...updateData };
      db.prisma.contact.update.mockResolvedValue(mockUpdatedContact);

      // Act
      const result = await contactService.update(id, updateData);

      // Assert
      expect(result).toEqual(mockUpdatedContact);
      expect(db.prisma.contact.update).toHaveBeenCalledTimes(1);
      expect(db.prisma.contact.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateData,
      });
    });

    it('should convert string id to number', async () => {
      // Arrange
      const updateData = { firstName: 'Johnny' };
      const mockUpdatedContact = { id: 1, ...updateData };
      db.prisma.contact.update.mockResolvedValue(mockUpdatedContact);

      // Act
      const result = await contactService.update('1', updateData);

      // Assert
      expect(result).toEqual(mockUpdatedContact);
      expect(db.prisma.contact.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateData,
      });
    });

    it('should handle database errors during update', async () => {
      // Arrange
      const error = new Error('Contact not found');
      db.prisma.contact.update.mockRejectedValue(error);

      // Act & Assert
      await expect(contactService.update(1, { firstName: 'John' })).rejects.toThrow('Contact not found');
    });
  });

  describe('delete', () => {
    it('should delete a contact', async () => {
      // Arrange
      const mockDeletedContact = { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com' };
      db.prisma.contact.delete.mockResolvedValue(mockDeletedContact);

      // Act
      const result = await contactService.delete(1);

      // Assert
      expect(result).toEqual(mockDeletedContact);
      expect(db.prisma.contact.delete).toHaveBeenCalledTimes(1);
      expect(db.prisma.contact.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should convert string id to number', async () => {
      // Arrange
      const mockDeletedContact = { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com' };
      db.prisma.contact.delete.mockResolvedValue(mockDeletedContact);

      // Act
      const result = await contactService.delete('1');

      // Assert
      expect(result).toEqual(mockDeletedContact);
      expect(db.prisma.contact.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should handle database errors during deletion', async () => {
      // Arrange
      const error = new Error('Contact not found');
      db.prisma.contact.delete.mockRejectedValue(error);

      // Act & Assert
      await expect(contactService.delete(1)).rejects.toThrow('Contact not found');
    });
  });
});
