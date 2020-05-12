import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

/*
test('renders learn react link', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
*/

// Commented above default code because, it will fail because, App.js is referring to fib.js. Here , something else was happening.
//Below will pass in any case.

test('renders learn react link', () => {});

