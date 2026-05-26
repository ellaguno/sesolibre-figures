import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the config screen with a Play button', () => {
  render(<App />);
  expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();
});
