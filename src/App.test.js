import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders VIN code search form', () => {
  const { container } = render(<App />);
  const vinForm = container.querySelector('[name="vin-form"]');
  expect(vinForm).toBeInTheDocument();
});
