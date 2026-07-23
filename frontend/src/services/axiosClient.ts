/**
 * Axios Client instance dedicated strictly to REST Upload calls.
 * Never used for GraphQL requests.
 */

import axios from 'axios';
import { API_BASE_URL } from '../constants';
import { tokenStorage } from './tokenStorage';

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  config => {
    const token = tokenStorage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Clear tokens if unauthorized REST response occurs
      tokenStorage.clearTokens();
    }
    return Promise.reject(error);
  }
);
