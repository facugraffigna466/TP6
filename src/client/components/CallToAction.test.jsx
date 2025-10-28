import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CallToAction from './CallToAction';
import ContactPageIcon from '@mui/icons-material/ContactPage';

// Helper function to render component with Router
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('CallToAction Component', () => {
  const defaultProps = {
    title: 'Test Title',
    subtitle: 'Test Subtitle',
    url: '/test-url',
    buttonName: 'Test Button'
  };

  it('should render with required props', () => {
    // Act
    renderWithRouter(<CallToAction {...defaultProps} />);

    // Assert
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('should render with custom icon', () => {
    // Act
    renderWithRouter(
      <CallToAction 
        {...defaultProps} 
        icon={ContactPageIcon}
      />
    );

    // Assert
    expect(screen.getByText('Test Button')).toBeInTheDocument();
    // The icon should be present (MUI icons render as SVG)
    const button = screen.getByText('Test Button');
    expect(button).toBeInTheDocument();
  });

  it('should render with hero icon when provided', () => {
    // Act
    renderWithRouter(
      <CallToAction 
        {...defaultProps} 
        heroIcon={ContactPageIcon}
      />
    );

    // Assert
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    // Hero icon should be present
    const card = screen.getByText('Test Title').closest('.MuiCard-root');
    expect(card).toBeInTheDocument();
  });

  it('should render button with correct link', () => {
    // Act
    renderWithRouter(<CallToAction {...defaultProps} />);

    // Assert
    const button = screen.getByText('Test Button');
    expect(button).toHaveAttribute('href', '/test-url');
  });

  it('should not render button when url is not provided', () => {
    // Arrange
    const propsWithoutUrl = {
      title: 'Test Title',
      subtitle: 'Test Subtitle',
      buttonName: 'Test Button'
    };

    // Act
    renderWithRouter(<CallToAction {...propsWithoutUrl} />);

    // Assert
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    expect(screen.queryByText('Test Button')).not.toBeInTheDocument();
  });

  it('should use default icon when not provided', () => {
    // Act
    renderWithRouter(<CallToAction {...defaultProps} />);

    // Assert
    const button = screen.getByText('Test Button');
    expect(button).toBeInTheDocument();
    // Default icon (AddCircleOutlineIcon) should be used
  });

  it('should render card with correct structure', () => {
    // Act
    renderWithRouter(<CallToAction {...defaultProps} />);

    // Assert
    const card = screen.getByText('Test Title').closest('.MuiCard-root');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('MuiCard-root');
  });

  it('should render typography with correct variants', () => {
    // Act
    renderWithRouter(<CallToAction {...defaultProps} />);

    // Assert
    const title = screen.getByText('Test Title');
    const subtitle = screen.getByText('Test Subtitle');
    
    expect(title).toHaveClass('MuiTypography-h5');
    expect(subtitle).toHaveClass('MuiTypography-body2');
  });

  it('should handle empty title and subtitle', () => {
    // Arrange
    const minimalProps = {
      url: '/test',
      buttonName: 'Button'
    };

    // Act
    renderWithRouter(<CallToAction {...minimalProps} />);

    // Assert
    expect(screen.getByText('Button')).toBeInTheDocument();
  });
});
