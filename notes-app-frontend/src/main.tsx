import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css'; 
import { ThemeProvider } from './context/ThemeContext'; 
// 1. Import các thành phần từ Apollo Client
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// 2. Tạo một link HTTP đến server GraphQL của bạn
const httpLink = createHttpLink({
  uri: 'http://localhost:3001/graphql',
});

// 3. Tạo một "middleware" link để tự động thêm token vào header
const authLink = setContext((_, { headers }) => {
  // Lấy token từ localStorage
  const token = localStorage.getItem('token');
  // Trả về các header cho context để httpLink có thể sử dụng
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

// 4. Tạo instance của Apollo Client, kết hợp authLink và httpLink
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(), // InMemoryCache là một hệ thống cache mạnh mẽ
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 5. Bọc toàn bộ ứng dụng trong ApolloProvider */}
    <ApolloProvider client={client}>
      <ThemeProvider>
        <App apolloClient={client}/>
      </ThemeProvider>
    </ApolloProvider>
  </React.StrictMode>,
);