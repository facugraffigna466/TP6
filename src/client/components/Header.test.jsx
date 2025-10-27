import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';

// Helper function to render component with Router
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Header Component', () => {
  beforeEach(() => {
    // Mock window.location for tests
    delete window.location;
    window.location = { href: 'http://localhost:3000' };
  });

  it('should render the header with logo and title', () => {
    // Act
    renderWithRouter(<Header />);

    // Assert
    expect(screen.getByAltText('logo')).toBeInTheDocument();
    expect(screen.getByText('simple-vite-react-express')).toBeInTheDocument();
  });

  it('should render navigation buttons', () => {
    // Act
    renderWithRouter(<Header />);

    // Assert
    expect(screen.getByText('Contacts')).toBeInTheDocument();
    expect(screen.getByText('Tasks')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
  });

  it('should have correct links for navigation buttons', () => {
    // Act
    renderWithRouter(<Header />);

    // Assert
    const contactsLink = screen.getByText('Contacts').closest('a');
    const tasksLink = screen.getByText('Tasks').closest('a');
    const projectsLink = screen.getByText('Projects').closest('a');

    expect(contactsLink).toHaveAttribute('href', '/contacts');
    expect(tasksLink).toHaveAttribute('href', '/tasks');
    expect(projectsLink).toHaveAttribute('href', '/projects');
  });

  it('should have correct logo attributes', () => {
    // Act
    renderWithRouter(<Header />);

    // Assert
    const logo = screen.getByAltText('logo');
    expect(logo).toHaveAttribute('src', '/template-logo.png');
    expect(logo).toHaveAttribute('height', '40');
  });

  it('should render AppBar with correct styling', () => {
    // Act
    renderWithRouter(<Header />);

    // Assert
    const appBar = screen.getByRole('banner');
    expect(appBar).toBeInTheDocument();
    expect(appBar).toHaveClass('MuiAppBar-root');
  });

  it('should render Toolbar with correct structure', () => {
    // Act
    renderWithRouter(<Header />);

    // Assert
    const toolbar = screen.getByText('Contacts').closest('.MuiToolbar-root');
    expect(toolbar).toBeInTheDocument();
    expect(toolbar).toHaveClass('MuiToolbar-root');
  });
});
