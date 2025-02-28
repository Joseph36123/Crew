// screens/auth/notifications.tsx
import React, { useEffect } from 'react';
import {
  View,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../types/types';
import { CrewButton, Title, Subtitle } from '../../components/atoms';
import * as Notifications from 'expo-notifications';

const { height } = Dimensions.get('window');

type NotificationsScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Notifications'>;

const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation<NotificationsScreenNavigationProp>();

  // Request notifications permission
  const requestNotificationsPermission = async () => {
    try {
      if (Platform.OS !== 'web') {
        const { status } = await Notifications.requestPermissionsAsync();
        return status === 'granted';
      }
      return false;
    } catch (error) {
      console.log('Error requesting notification permission:', error);
      return false;
    }
  };

  useEffect(() => {
    // Show system notification permission dialog
    const showNotificationDialog = async () => {
      // On iOS, the permission request will show the native iOS notification prompt
      // On Android, this is handled differently based on the version
      const permission = await requestNotificationsPermission();
      console.log('Notification permission granted:', permission);
    };

    // Delay the notification prompt slightly for better UX
    const timer = setTimeout(() => {
      showNotificationDialog();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    // Navigate to the main app
    navigation.reset({
      index: 0,
      routes: [{ name: 'TabNavigator' as any }],
    });
  };

  const handleSkip = () => {
    // Navigate to the main app even if notifications are declined
    navigation.reset({
      index: 0,
      routes: [{ name: 'TabNavigator' as any }],
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-[#191919]">
        {/* Crew Logo */}
        <Image
          source={require('../../assets/images/logo.png')}
          style={{
            position: 'absolute',
            alignSelf: 'center',
            width: 400,
            height: 400,
            top: height * -0.085,
            zIndex: 1,
          }}
          resizeMode="contain"
        />

        {/* White Container */}
        <View className="absolute top-[30%] z-20 h-[70%] w-full rounded-t-[40px] bg-white">
          <View className="flex-1 items-center px-5 pb-10 pt-12">
            {/* Title */}
            <Title 
              text="Turn on notifications" 
              containerClassName="mb-4"
            />

            {/* Subtitle */}
            <Subtitle
              text="Don't miss out on important messages, notifications,\nand other account activities"
              containerClassName="mb-auto w-[320px]"
            />

            {/* Continue Button */}
            <CrewButton
              variant="filled"
              text="Continue"
              color="secondary"
              size="large"
              fullWidth={true}
              onPress={handleContinue}
              className="mb-4"
            />

            {/* No Thanks Button */}
            <CrewButton
              variant="outlined"
              text="No Thanks"
              color="secondary"
              size="large"
              fullWidth={true}
              onPress={handleSkip}
            />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default NotificationsScreen;