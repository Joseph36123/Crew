import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API base URLs for different environments
const API_URLS = {
  development: 'http://192.168.1.94:5000/api/v1',

  emulator: 'http://10.0.2.2:5000/api/v1/', // Special IP for Android emulator to reach host
  production: 'https://api.yourproductionurl.com/api/v1',
};

const BASE_URL = API_URLS.development;

console.log('API is configured with base URL:', BASE_URL);

// Create axios instance with default settings
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout to see if requests are hanging
  timeout: 10000,
});

// Request interceptor to add authorization token to requests
api.interceptors.request.use(
  async (config) => {
    console.log(
      `🚀 Making ${config.method?.toUpperCase()} request to: ${config.baseURL}${config.url}`,
      {
        data: config.data,
        headers: config.headers,
      }
    );

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Added authorization token to request');
      }
    } catch (err) {
      console.log('Error retrieving authorization token: ', err);
    }
    return config;
  },
  (error) => {
    console.log('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Response from ${response.config.url}:`, {
      status: response.status,
      data: response.data,
    });
    return response.data;
  },
  async (error) => {
    console.log('🔴 Error in API call:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    const originalRequest = error.config;

    // Check if error.response exists before accessing its properties
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log('Received 401 error, clearing token');
      // clear token if expired and redirect to login
      await AsyncStorage.removeItem('userToken');
    }

    // Provide a detailed error message
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(errorMessage);
  }
);

// API service functions with better error handling and logging
export const authService = {
  login: async (phoneNumber: string) => {
    console.log('Calling login API with phone number:', phoneNumber);
    try {
      const response = await api.post('/auth/login', { phoneNumber });
      console.log('Login API response:', response);
      return response;
    } catch (error) {
      console.log('Login API error caught in service:', error);
      throw error;
    }
  },

  register: async (userData: { fullName: string; phoneNumber: string }) => {
    console.log('Calling register API with data:', userData);
    try {
      const response = await api.post('/auth/register', userData);
      console.log('Register API response:', response);
      return response;
    } catch (error) {
      console.log('Register API error caught in service:', error);
      throw error;
    }
  },

  verifyOTP: async (phoneNumber: string, otp: string) => {
    console.log('Calling verify OTP API with:', { phoneNumber, otp });
    try {
      const response = await api.post('/auth/verify', { phoneNumber, otp });
      console.log('Verify OTP API response:', response);
      return response;
    } catch (error) {
      console.log('Verify OTP API error caught in service:', error);
      throw error;
    }
  },

  resendOTP: async (phoneNumber: string) => {
    console.log('Calling resend OTP API with phone number:', phoneNumber);
    try {
      const response = await api.post('/auth/resend-otp', { phoneNumber });
      console.log('Resend OTP API response:', response);
      return response;
    } catch (error) {
      console.log('Resend OTP API error caught in service:', error);
      throw error;
    }
  },
};

export const profileService = {
  getProfileStatus: async (userId: string) => {
    return api.get(`/user/profile/${userId}/status`);
  },

  getUserProfile: async (userId: string) => {
    return api.get(`/user/profile/${userId}`);
  },

  completeProfile: async (userId: string, profileData: FormData) => {
    return api.patch(`/user/profile/${userId}/complete`, profileData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default api;
