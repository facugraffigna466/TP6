import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import Home from './Home';

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

// Mock DatabaseSetupGuide component
jest.mock('../components/DatabaseSetupGuide', () => {
  return function MockDatabaseSetupGuide({ onRetry }) {
    return (
      <div data-testid="database-setup-guide">
        <button onClick={onRetry}>Retry Connection</button>
      </div>
    );
  };
});

// Helper function to render component with Router
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Home Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should show loading state initially', () => {
    // Arrange
    mockedAxios.get.mockImplementation(() => new Promise(() => {})); // Never resolves

    // Act
    renderWithRouter(<Home />);

    // Assert
    expect(screen.getByText('Checking database connection...')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should show database setup guide when connection fails', async () => {
    // Arrange
    mockedAxios.get.mockRejectedValue(new Error('Connection failed'));

    // Act
    renderWithRouter(<Home />);

    // Assert
    await waitFor(() => {
      expect(screen.getByTestId('database-setup-guide')).toBeInTheDocument();
    });
  });

  it('should show success state when database is connected', async () => {
    // Arrange
    mockedAxios.get.mockImplementation((url) => {
      if (url === '/api/v1/health') {
        return Promise.resolve({ data: 'OK' });
      }
      if (url === '/api/v1/contact/list') {
        return Promise.resolve({ data: { data: [{ id: 1, name: 'John' }] } });
      }
      return Promise.resolve({ data: { data: [] } });
    });

    // Act
    renderWithRouter(<Home />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Modern Full-Stack Template')).toBeInTheDocument();
      expect(screen.getByText('A production-ready project management system built with React, Express, and PostgreSQL')).toBeInTheDocument();
    });
  });

  it('should display feature cards with correct content', async () => {
    // Arrange
    mockedAxios.get.mockImplementation((url) => {
      if (url === '/api/v1/health') {
        return Promise.resolve({ data: 'OK' });
      }
      if (url === '/api/v1/contact/list') {
        return Promise.resolve({ data: { data: [{ id: 1, name: 'John' }] } });
      }
      return Promise.resolve({ data: { data: [] } });
    });

    // Act
    renderWithRouter(<Home />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText("What's Included")).toBeInTheDocument();
      expect(screen.getByText('Contact Management')).toBeInTheDocument();
      expect(screen.getByText('Task Management')).toBeInTheDocument();
      expect(screen.getByText('Project Management')).toBeInTheDocument();
    });
  });

  it('should display technical features section', async () => {
    // Arrange
    mockedAxios.get.mockImplementation((url) => {
      if (url === '/api/v1/health') {
        return Promise.resolve({ data: 'OK' });
      }
      return Promise.resolve({ data: { data: [] } });
    });

    // Act
    renderWithRouter(<Home />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Technical Features')).toBeInTheDocument();
      expect(screen.getByText('Modern Stack')).toBeInTheDocument();
      expect(screen.getByText('Developer Experience')).toBeInTheDocument();
      expect(screen.getByText('Production Ready')).toBeInTheDocument();
    });
  });

  it('should show success alert when database has data', async () => {
    // Arrange
    mockedAxios.get.mockImplementation((url) => {
      if (url === '/api/v1/health') {
        return Promise.resolve({ data: 'OK' });
      }
      if (url === '/api/v1/contact/list') {
        return Promise.resolve({ data: { data: [{ id: 1, name: 'John' }] } });
      }
      return Promise.resolve({ data: { data: [] } });
    });

    // Act
    renderWithRouter(<Home />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('🎉 Database is set up with sample data! Explore the features below.')).toBeInTheDocument();
    });
  });

  it('should render action buttons', async () => {
    // Arrange
    mockedAxios.get.mockImplementation((url) => {
      if (url === '/api/v1/health') {
        return Promise.resolve({ data: 'OK' });
      }
      return Promise.resolve({ data: { data: [] } });
    });

    // Act
    renderWithRouter(<Home />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Explore Features')).toBeInTheDocument();
      expect(screen.getByText('View on GitHub')).toBeInTheDocument();
    });
  });

  it('should have correct GitHub link', async () => {
    // Arrange
    mockedAxios.get.mockImplementation((url) => {
      if (url === '/api/v1/health') {
        return Promise.resolve({ data: 'OK' });
      }
      return Promise.resolve({ data: { data: [] } });
    });

    // Act
    renderWithRouter(<Home />);

    // Assert
    await waitFor(() => {
      const githubButton = screen.getByText('View on GitHub');
      expect(githubButton).toHaveAttribute('href', 'https://github.com/Avinava/simple-vite-react-express');
      expect(githubButton).toHaveAttribute('target', '_blank');
      expect(githubButton).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it('should call checkDatabaseConnection on mount', () => {
    // Arrange
    mockedAxios.get.mockImplementation(() => new Promise(() => {})); // Never resolves

    // Act
    renderWithRouter(<Home />);

    // Assert
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/v1/health');
  });

  it('should handle server not responding', async () => {
    // Arrange
    mockedAxios.get.mockRejectedValue(new Error('Network Error'));

    // Act
    renderWithRouter(<Home />);

    // Assert
    await waitFor(() => {
      expect(screen.getByTestId('database-setup-guide')).toBeInTheDocument();
    });
  });
});
