import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import type { ApolloClient, NormalizedCacheObject } from '@apollo/client';

interface AppProps {
  apolloClient: ApolloClient<NormalizedCacheObject>;
}
// 3. Component App bây giờ nhận vào một prop là apolloClient
function App({ apolloClient }: AppProps) {
  return (
    // 4. Truyền apolloClient xuống cho AuthProvider
    <AuthProvider apolloClient={apolloClient}>
      <Router>
        <Routes>
          {/* Public Routes: Ai cũng có thể truy cập */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes: Chỉ người dùng đã đăng nhập mới có thể truy cập */}
          {/* ProtectedRoute sẽ kiểm tra và điều hướng nếu cần */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />
          </Route>

          {/* Fallback Route: Nếu người dùng truy cập một đường dẫn không tồn tại,
              chuyển hướng họ về trang chủ */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;