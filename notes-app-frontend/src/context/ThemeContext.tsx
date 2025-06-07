// src/context/ThemeContext.tsx

import React, { createContext, useState, useMemo,type ReactNode, useContext } from 'react';

// Định nghĩa kiểu dữ liệu cho theme và context
type Theme = 'light' | 'dark';
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// Tạo Context
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Tạo Provider Component
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Lấy theme từ localStorage nếu có, mặc định là 'light'
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    return savedTheme || 'light';
  });

  // Hàm để chuyển đổi theme
  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme); // Lưu theme mới vào localStorage
      return newTheme;
    });
  };

  // Sử dụng useMemo để áp dụng theme vào thẻ <body> mỗi khi theme thay đổi
  useMemo(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook để sử dụng ThemeContext dễ dàng hơn
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};