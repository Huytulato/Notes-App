import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from '../graphql/mutations';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login: authLogin } = useAuth(); // Đổi tên để tránh trùng lặp
  const navigate = useNavigate();

  // Sử dụng useMutation hook
  const [login, { loading, error }] = useMutation(LOGIN_MUTATION, {
    // onCompleted sẽ được gọi khi mutation thành công
    onCompleted: (data) => {
      const { access_token } = data.login;
      authLogin(access_token); // Gọi hàm login từ AuthContext để lưu token
      navigate('/'); // Chuyển hướng đến trang chủ
    },
    // onError sẽ được gọi khi có lỗi từ GraphQL
    onError: (err) => {
      console.error("Login error:", err);
      // Lỗi sẽ được hiển thị tự động qua biến 'error'
    }
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    login({
      variables: {
        loginInput: { email, password },
      },
    });
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} />
        </div>
        {/* Hiển thị lỗi từ Apollo Client */}
        {error && <p style={{ color: 'red' }}>{error.message}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default LoginPage;