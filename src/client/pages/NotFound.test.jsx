import React from 'react';
import { render, screen } from '@testing-library/react';
import NotFound from './NotFound';

// Mock AppHeroIcon component
jest.mock('../components/AppHeroIcon', () => {
  return function MockAppHeroIcon() {
    return <div data-testid="app-hero-icon">App Hero Icon</div>;
  };
});

describe('NotFound Component', () => {
  it('should render 404 page with correct content', () => {
    // Act
    render(<NotFound />);

    // Assert
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText("The page you're looking for cannot be found.")).toBeInTheDocument();
  });

  it('should render AppHeroIcon component', () => {
    // Act
    render(<NotFound />);

    // Assert
    expect(screen.getByTestId('app-hero-icon')).toBeInTheDocument();
  });

  it('should render sad face icon', () => {
    // Act
    render(<NotFound />);

    // Assert
    const sadIcon = screen.getByTestId('SentimentVeryDissatisfiedIcon');
    expect(sadIcon).toBeInTheDocument();
  });

  it('should have correct typography variants', () => {
    // Act
    render(<NotFound />);

    // Assert
    const title = screen.getByText('404');
    const subtitle = screen.getByText("The page you're looking for cannot be found.");
    
    expect(title).toHaveClass('MuiTypography-h4');
    expect(subtitle).toHaveClass('MuiTypography-subtitle1');
  });

  it('should render with correct container structure', () => {
    // Act
    render(<NotFound />);

    // Assert
    const container = screen.getByText('404').closest('.MuiContainer-root');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('MuiContainer-maxWidthXl');
  });

  it('should render card with correct structure', () => {
    // Act
    render(<NotFound />);

    // Assert
    const card = screen.getByText('404').closest('.MuiCard-root');
    expect(card).toBeInTheDocument();
  });

  it('should center content vertically and horizontally', () => {
    // Act
    render(<NotFound />);

    // Assert
    const box = screen.getByText('404').closest('.MuiBox-root');
    expect(box).toHaveStyle({
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    });
  });

  it('should have correct height for content area', () => {
    // Act
    render(<NotFound />);

    // Assert
    const box = screen.getByText('404').closest('.MuiBox-root');
    expect(box).toHaveStyle({
      height: '50vh'
    });
  });
});
