import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api', // URL backend của bạn
});

// Interceptor để tự động đính kèm token vào header của mỗi request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default apiClient;