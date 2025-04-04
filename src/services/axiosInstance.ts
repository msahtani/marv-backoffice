import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { refreshToken, getStoredTokens, isTokenExpired, saveTokens } from './authService';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const axiosInstance = axios.create({
  baseURL,
});

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const { accessToken, refreshToken: storedRefreshToken, tokenExpiresAt } = getStoredTokens();
    
    if (accessToken) {
      if (isTokenExpired(tokenExpiresAt)) {
        try {
          const newTokens = await refreshToken(storedRefreshToken!);
          saveTokens(newTokens);
          config.headers.Authorization = `Bearer ${newTokens.access_token}`;
        } catch (error) {
          // Handle refresh token failure
          console.error('Failed to refresh token:', error);
        }
      } else {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      // You might want to redirect to login or clear tokens
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 