import api from './api';

export interface PreferenceItem {
  _id: string;
  title: string;
  imageUrl: string;
}

export interface ProfileUpdateData {
  gender?: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  age?: number;
  school?: string;
  culture?: string;
  hometown?: string;
  avatar?: string;
  vibes?: string[];
  hobbies?: string[];
  scenes?: string[];
  profileCompleted?: boolean;
  termsAndConditionsAccepted?: boolean;
}

export const profileService = {
  // Get profile status to check if profile is complete
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

  // Get user profile data
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

  // Complete the entire profile
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

  // Fetch vibes from the backend
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

  // Fetch scenes from the backend
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

  // Fetch hobbies from the backend
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

  // Update profile information incrementally
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

export default profileService;
