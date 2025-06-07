import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css'; // Bạn có thể thêm CSS cho Dark Theme ở đây
import { ThemeProvider } from './context/ThemeContext'; // <-- IMPORT ThemeProvider


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Bọc App bằng ThemeProvider */}
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);