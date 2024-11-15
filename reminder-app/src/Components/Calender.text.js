// src/Components/Calendar.test.js
import { render, screen } from '@testing-library/react';
import Calendar from './Calendar';

test('renders calendar component', () => {
  render(<Calendar />);
  const calendarElement = screen.getByText(/Loading reminders/i);
  expect(calendarElement).toBeInTheDocument();
});
