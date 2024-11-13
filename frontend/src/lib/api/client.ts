import axios from 'axios';
import { AnalysisResponse, UploadResponse } from '@/types/analytics';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      return Promise.reject({
        message: error.response.data.message || 'An error occurred',
        code: error.response.status,
      });
    } else if (error.request) {
      // Request made but no response received
      return Promise.reject({
        message: 'No response from server',
        code: 'NETWORK_ERROR',
      });
    } else {
      // Error setting up request
      return Promise.reject({
        message: error.message,
        code: 'REQUEST_ERROR',
      });
    }
  }
);

// API endpoints
export const endpoints = {
  upload: '/api/upload',
  analyze: '/api/analyze',
  latest: '/api/analytics/latest',
};

// API methods
export const apiMethods = {
  uploadFile: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<UploadResponse>(endpoints.upload, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getAnalysis: async (sessionId: string): Promise<AnalysisResponse> => {
    const response = await api.get<AnalysisResponse>(`${endpoints.analyze}/${sessionId}`);
    return response.data;
  },

  getLatestAnalytics: async () => {
    const response = await api.get(endpoints.latest);
    return response.data;
  },
};

export default api;
