import React from 'react';
import { render } from '@testing-library/react';
import App, { SignIn } from "./App";

// test("Money Talks header check", () => {
//   const { getByText } = render(<App />);
//   const text = getByText(/Money Talks/i);
//   expect(text).toBeInTheDocument();
// });

test("login button check", () => {
  const { getByText } = render(<SignIn />);
  const loginButton = getByText(/sign in/i);
  expect(loginButton).toBeInTheDocument();
});
