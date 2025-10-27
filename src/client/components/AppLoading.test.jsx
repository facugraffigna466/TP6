import React from 'react';
import { render, screen } from '@testing-library/react';
import AppLoading from './AppLoading';

describe('AppLoading Component', () => {
  it('should render the loading component', () => {
    // Act
    render(<AppLoading />);

    // Assert
    expect(screen.getByAltText('Template logo')).toBeInTheDocument();
  });

  it('should render logo with correct attributes', () => {
    // Act
    render(<AppLoading />);

    // Assert
    const logo = screen.getByAltText('Template logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/template-logo.png');
    expect(logo).toHaveAttribute('height', '150');
  });

  it('should render loading bar', () => {
    // Act
    render(<AppLoading />);

    // Assert
    const loadingBar = screen.getByAltText('Template logo').parentElement?.querySelector('.light-bar');
    expect(loadingBar).toBeInTheDocument();
  });

  it('should have correct container class', () => {
    // Act
    render(<AppLoading />);

    // Assert
    const container = screen.getByAltText('Template logo').parentElement;
    expect(container).toHaveClass('icon-container');
  });

  it('should apply correct styling to logo', () => {
    // Act
    render(<AppLoading />);

    // Assert
    const logo = screen.getByAltText('Template logo');
    expect(logo).toHaveStyle({
      marginBottom: '-10px'
    });
  });
});
