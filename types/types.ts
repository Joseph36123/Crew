export type RootStackParamList = {
  TabNavigator: undefined;
  Modal: undefined;
  Auth: undefined;
  Onboarding: undefined;
  profileSetUp: undefined;
  Main: undefined;
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
