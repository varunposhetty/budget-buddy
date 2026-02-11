import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Budget Buddy header', () => {
  render(<App />);
  const heading = screen.getByText(/Budget Buddy/i);
  expect(heading).toBeInTheDocument();
});

test('renders Add Transaction section', () => {
  render(<App />);
  const addBtn = screen.getByText(/Add/i);
  expect(addBtn).toBeInTheDocument();
});
