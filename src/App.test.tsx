import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders task list title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Список задач/i);
  expect(titleElement).toBeInTheDocument();
});
