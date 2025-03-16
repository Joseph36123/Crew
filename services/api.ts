import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API base URLs for different environments
const API_URLS = {
  production: 'https://crew-social-api-staging.onrender.com/api/v1',
  emulator: 'http://10.0.2.2:5000/api/v1/',
};

const BASE_URL = API_URLS.production;

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

export interface PreferenceItem {
  _id: string;
  title: string;
  imageUrl: string;
}

export interface ProfileUpdateData {
  gender?: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  school?: string;
  culture?: string;
  hometown?: string;
  avatar?: string;
  vibes?: string[];
  hobbies?: string[];
  scenes?: string[];
  profileCompleted?: boolean;
}

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

  validateToken: async () => {
    console.log('Validating user token');
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID not found in storage');
      }

      const response = await api.get(`/user/profile/${userId}/status`);
      console.log('Token validation response:', response);
      return response;
    } catch (error) {
      console.log('Token validation error caught in service:', error);
      throw error;
    }
  },
};

// Then add these methods to your existing profileService object in api.ts
export const profileService = {
  // Existing methods
  getProfileStatus: async (userId: string) => {
    console.log('Calling getProfileStatus API with user ID:', userId);
    try {
      const response = await api.get(`/user/profile/${userId}/status`);
      console.log('GetProfileStatus API response:', response);
      return response;
    } catch (error) {
      console.log('GetProfileStatus API error caught in service:', error);
      throw error;
    }
  },

  getUserProfile: async (userId: string) => {
    console.log('Calling getUserProfile API with user ID:', userId);
    try {
      const response = await api.get(`/user/profile/${userId}`);
      console.log('GetUserProfile API response:', response);
      return response;
    } catch (error) {
      console.log('GetUserProfile API error caught in service:', error);
      throw error;
    }
  },

  completeProfile: async (userId: string, profileData: FormData) => {
    console.log('Calling completeProfile API with user ID:', userId);
    try {
      const response = await api.patch(`/user/profile/${userId}/complete`, profileData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('CompleteProfile API response:', response);
      return response;
    } catch (error) {
      console.log('CompleteProfile API error caught in service:', error);
      throw error;
    }
  },

  // New methods for preferences and incremental updates
  getVibes: async () => {
    console.log('Fetching vibes');
    try {
      const response = await api.get('/preferences/vibes');
      console.log('Vibes API response:', response);
      return response;
    } catch (error) {
      console.log('GetVibes API error caught in service:', error);
      throw error;
    }
  },

  getScenes: async () => {
    console.log('Fetching scenes');
    try {
      const response = await api.get('/preferences/scenes');
      console.log('Scenes API response:', response);
      return response;
    } catch (error) {
      console.log('GetScenes API error caught in service:', error);
      throw error;
    }
  },

  getHobbies: async () => {
    console.log('Fetching hobbies');
    try {
      const response = await api.get('/preferences/hobbies');
      console.log('Hobbies API response:', response);
      return response;
    } catch (error) {
      console.log('GetHobbies API error caught in service:', error);
      throw error;
    }
  },

  updateProfile: async (userId: string, profileData: ProfileUpdateData) => {
    console.log('Updating profile for user ID:', userId, 'with data:', profileData);

    try {
      const formData = new FormData();

      // Add text fields
      if (profileData.gender) {
        formData.append('gender', profileData.gender);
      }

      if (profileData.dateOfBirth) {
        formData.append('dateOfBirth', profileData.dateOfBirth);
      }

      if (profileData.school) {
        formData.append('school', profileData.school);
      }

      if (profileData.culture) {
        formData.append('culture', profileData.culture);
      }

      if (profileData.hometown) {
        formData.append('hometown', profileData.hometown);
      }

      // Add arrays as JSON strings
      if (profileData.vibes && profileData.vibes.length > 0) {
        formData.append('vibes', JSON.stringify(profileData.vibes));
      }

      if (profileData.hobbies && profileData.hobbies.length > 0) {
        formData.append('hobbies', JSON.stringify(profileData.hobbies));
      }

      if (profileData.scenes && profileData.scenes.length > 0) {
        formData.append('scenes', JSON.stringify(profileData.scenes));
      }

      // Profile completion flag if provided
      if (profileData.profileCompleted !== undefined) {
        formData.append('profileCompleted', String(profileData.profileCompleted));
      }

      // If avatar is a file URI, add it to form data
      if (profileData.avatar && profileData.avatar.startsWith('file:')) {
        const filename = profileData.avatar.split('/').pop() || 'avatar.jpg';

        formData.append('avatar', {
          uri: profileData.avatar,
          name: filename,
          type: 'image/jpeg',
        } as any);
      }

      // Use the same endpoint as completeProfile but with PATCH method
      const response = await api.patch(`/user/profile/${userId}/complete`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Update profile API response:', response);
      return response;
    } catch (error) {
      console.log('Update profile API error caught in service:', error);
      throw error;
    }
  },
};

export default api;
