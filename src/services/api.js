import axios from "axios";
import { TOKEN_STORAGE_NAME } from '../utils/constants';

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1"
})

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem(TOKEN_STORAGE_NAME);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      sessionStorage.removeItem(TOKEN_STORAGE_NAME);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
)

export default api;
