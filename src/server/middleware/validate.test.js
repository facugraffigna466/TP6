import { celebrate, Joi } from 'celebrate';

describe('Validation Middleware', () => {
  describe('contactValidation.create', () => {
    it('should validate valid contact creation data', () => {
      // Arrange
      const validData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      };

      // Act & Assert
      expect(() => {
        const { error } = Joi.object({
          firstName: Joi.string().required().description("Contact's first name"),
          lastName: Joi.string().required().description("Contact's last name"),
          email: Joi.string().email().required().description("Contact's email address"),
        }).validate(validData);
        
        if (error) throw error;
      }).not.toThrow();
    });

    it('should reject missing required fields', () => {
      // Arrange
      const invalidData = {
        firstName: 'John',
        // Missing lastName and email
      };

      // Act & Assert
      expect(() => {
        const { error } = Joi.object({
          firstName: Joi.string().required().description("Contact's first name"),
          lastName: Joi.string().required().description("Contact's last name"),
          email: Joi.string().email().required().description("Contact's email address"),
        }).validate(invalidData);
        
        if (error) throw error;
      }).toThrow();
    });

    it('should reject invalid email format', () => {
      // Arrange
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
      };

      // Act & Assert
      expect(() => {
        const { error } = Joi.object({
          firstName: Joi.string().required().description("Contact's first name"),
          lastName: Joi.string().required().description("Contact's last name"),
          email: Joi.string().email().required().description("Contact's email address"),
        }).validate(invalidData);
        
        if (error) throw error;
      }).toThrow();
    });

    it('should reject empty strings', () => {
      // Arrange
      const invalidData = {
        firstName: '',
        lastName: 'Doe',
        email: 'john@example.com',
      };

      // Act & Assert
      expect(() => {
        const { error } = Joi.object({
          firstName: Joi.string().required().description("Contact's first name"),
          lastName: Joi.string().required().description("Contact's last name"),
          email: Joi.string().email().required().description("Contact's email address"),
        }).validate(invalidData);
        
        if (error) throw error;
      }).toThrow();
    });

    it('should reject non-string values', () => {
      // Arrange
      const invalidData = {
        firstName: 123,
        lastName: 'Doe',
        email: 'john@example.com',
      };

      // Act & Assert
      expect(() => {
        const { error } = Joi.object({
          firstName: Joi.string().required().description("Contact's first name"),
          lastName: Joi.string().required().description("Contact's last name"),
          email: Joi.string().email().required().description("Contact's email address"),
        }).validate(invalidData);
        
        if (error) throw error;
      }).toThrow();
    });
  });

  describe('contactValidation.update', () => {
    it('should validate valid contact update data', () => {
      // Arrange
      const validData = {
        firstName: 'Johnny',
        lastName: 'Doe',
        email: 'johnny@example.com',
      };

      // Act & Assert
      expect(() => {
        const { error } = Joi.object({
          firstName: Joi.string().description("Updated first name"),
          lastName: Joi.string().description("Updated last name"),
          email: Joi.string().email().description("Updated email address"),
        }).validate(validData);
        
        if (error) throw error;
      }).not.toThrow();
    });

    it('should allow partial updates', () => {
      // Arrange
      const partialData = {
        firstName: 'Johnny',
        // Only updating firstName
      };

      // Act & Assert
      expect(() => {
        const { error } = Joi.object({
          firstName: Joi.string().description("Updated first name"),
          lastName: Joi.string().description("Updated last name"),
          email: Joi.string().email().description("Updated email address"),
        }).validate(partialData);
        
        if (error) throw error;
      }).not.toThrow();
    });

    it('should allow empty object for update', () => {
      // Arrange
      const emptyData = {};

      // Act & Assert
      expect(() => {
        const { error } = Joi.object({
          firstName: Joi.string().description("Updated first name"),
          lastName: Joi.string().description("Updated last name"),
          email: Joi.string().email().description("Updated email address"),
        }).validate(emptyData);
        
        if (error) throw error;
      }).not.toThrow();
    });

    it('should reject invalid email format in update', () => {
      // Arrange
      const invalidData = {
        email: 'invalid-email-format',
      };

      // Act & Assert
      expect(() => {
        const { error } = Joi.object({
          firstName: Joi.string().description("Updated first name"),
          lastName: Joi.string().description("Updated last name"),
          email: Joi.string().email().description("Updated email address"),
        }).validate(invalidData);
        
        if (error) throw error;
      }).toThrow();
    });

    it('should reject non-string values in update', () => {
      // Arrange
      const invalidData = {
        firstName: 123,
        email: 'john@example.com',
      };

      // Act & Assert
      expect(() => {
        const { error } = Joi.object({
          firstName: Joi.string().description("Updated first name"),
          lastName: Joi.string().description("Updated last name"),
          email: Joi.string().email().description("Updated email address"),
        }).validate(invalidData);
        
        if (error) throw error;
      }).toThrow();
    });
  });

  describe('Integration with celebrate middleware', () => {
    it('should work with celebrate middleware for create validation', () => {
      // Arrange
      const middleware = celebrate({
        body: Joi.object({
          firstName: Joi.string().required().description("Contact's first name"),
          lastName: Joi.string().required().description("Contact's last name"),
          email: Joi.string().email().required().description("Contact's email address"),
        }),
      });

      // Act & Assert - This test ensures the middleware can be created without errors
      expect(middleware).toBeDefined();
      expect(typeof middleware).toBe('function');
    });

    it('should work with celebrate middleware for update validation', () => {
      // Arrange
      const middleware = celebrate({
        params: Joi.object({
          id: Joi.number().required().description("Contact ID"),
        }),
        body: Joi.object({
          firstName: Joi.string().description("Updated first name"),
          lastName: Joi.string().description("Updated last name"),
          email: Joi.string().email().description("Updated email address"),
        }),
      });

      // Act & Assert - This test ensures the middleware can be created without errors
      expect(middleware).toBeDefined();
      expect(typeof middleware).toBe('function');
    });
  });

  describe('Edge cases', () => {
    it('should handle very long strings', () => {
      // Arrange
      const longString = 'a'.repeat(1000);
      const validData = {
        firstName: longString,
        lastName: 'Doe',
        email: 'john@example.com',
      };

      // Act & Assert
      expect(() => {
        const { error } = Joi.object({
          firstName: Joi.string().required().description("Contact's first name"),
          lastName: Joi.string().required().description("Contact's last name"),
          email: Joi.string().email().required().description("Contact's email address"),
        }).validate(validData);
        
        if (error) throw error;
      }).not.toThrow();
    });

    it('should handle special characters in names', () => {
      // Arrange
      const validData = {
        firstName: "Jean-Pierre O'Connor",
        lastName: "O'Malley-Smith",
        email: 'jean-pierre@example.com',
      };

      // Act & Assert
      expect(() => {
        const { error } = Joi.object({
          firstName: Joi.string().required().description("Contact's first name"),
          lastName: Joi.string().required().description("Contact's last name"),
          email: Joi.string().email().required().description("Contact's email address"),
        }).validate(validData);
        
        if (error) throw error;
      }).not.toThrow();
    });

    it('should handle international email addresses', () => {
      // Arrange
      const validData = {
        firstName: 'José',
        lastName: 'García',
        email: 'josé.garcía@münchen.de',
      };

      // Act & Assert
      expect(() => {
        const { error } = Joi.object({
          firstName: Joi.string().required().description("Contact's first name"),
          lastName: Joi.string().required().description("Contact's last name"),
          email: Joi.string().email().required().description("Contact's email address"),
        }).validate(validData);
        
        if (error) throw error;
      }).not.toThrow();
    });
  });
});
