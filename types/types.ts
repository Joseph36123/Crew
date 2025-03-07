export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Onboarding: undefined;
  TabNavigator: undefined;
  profileSetUp: undefined;
  Modal: undefined;
};

export type AuthStackParamList = {
  Signin: undefined;
  Signup: undefined;
  OTPVerification: {
    phoneNumber: string;
  };
  TermsConditions: undefined;
  Notifications: undefined;
};

export type OnboardingStackParamList = {
  TermsConditions: undefined;
  Notifications: undefined;
};

export type ProfileSetupStackParamList = {
  ProfileSetupPlaceholder: undefined;
  // ProfileBasic: undefined;
  // ProfilePreferences: undefined;
  // ProfileAvatar: undefined;
};
