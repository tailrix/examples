import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// A simple component to test
const WelcomeMessage: React.FC<{ name?: string }> = ({ name = 'Guest' }) => {
  return <p>Welcome, {name}!</p>;
};

describe('SampleComponent', () => {
  it('renders a welcome message', () => {
    render(<WelcomeMessage name="TestUser" />);
    expect(screen.getByText('Welcome, TestUser!')).toBeInTheDocument();
  });

  it('renders a default welcome message if no name is provided', () => {
    render(<WelcomeMessage />);
    expect(screen.getByText('Welcome, Guest!')).toBeInTheDocument();
  });
});

describe('Basic Truthiness', () => {
  it('should confirm true is true', () => {
    expect(true).toBe(true);
  });
});
