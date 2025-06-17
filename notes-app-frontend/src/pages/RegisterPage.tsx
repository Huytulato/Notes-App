import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { REGISTER_MUTATION } from '../graphql/mutations';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const [register, { loading, error }] = useMutation(REGISTER_MUTATION, {
    onCompleted: () => {
      // Sau khi đăng ký thành công, chuyển hướng đến trang đăng nhập
      alert('Registration successful! Please log in.');
      navigate('/login');
    },
    onError: (err) => {
      console.error("Registration error:", err);
    }
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      // Tạm thời giữ lại validation đơn giản ở client
      alert('Password must be at least 6 characters long.');
      return;
    }
    register({
      variables: {
        registerInput: { email, password },
      },
    });
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} />
        </div>
        {error && <p style={{ color: 'red' }}>{error.message}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default RegisterPage;