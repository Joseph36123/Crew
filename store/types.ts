export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  userId: string | null;
  tempPhoneNumber: string | null; // For OTP verification flow
  tempFullName: string | null; // For registration flow
  error: string | null;
  otpSent: boolean;
  currentAuthMode: 'login' | 'register' | null;
}

export const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  token: null,
  userId: null,
  tempPhoneNumber: null,
  tempFullName: null,
  error: null,
  otpSent: false,
  currentAuthMode: null,
};

// Define interface for profile data
export interface ILocation {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}
export interface ProfileData {
  fullName: string;
  phoneNumber: string;
  avatar?: string;
  bio?: string;
  vibes?: string[];
  hobbies?: string[];
  scenes?: string[];
  culture?: string;
  profileCompleted: boolean;
  school?: string;
  occupation?: string;
  dateOfBirth?: string;
  gender?: string;
  location?: ILocation;
}

// Define the profile state
export interface ProfileState {
  isProfileComplete: boolean;
  isLoading: boolean;
  profileData: ProfileData | null;
  error: string | null;
}
