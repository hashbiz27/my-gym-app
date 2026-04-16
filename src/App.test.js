import { render, screen } from '@testing-library/react';
import App from './App';

test('renders gym app', () => {
  render(<App />);
  const heading = screen.getByText(/Choose Your Programme/i);
  expect(heading).toBeInTheDocument();
});
