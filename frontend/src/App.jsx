// src/App.jsx
// The application shell is handled by AppRouter + layouts.
// This file is intentionally minimal – all routing lives in src/routes/AppRouter.jsx.
import React from 'react';
import AppRouter from './routes/AppRouter';

export default function App() {
  return <AppRouter />;
}
