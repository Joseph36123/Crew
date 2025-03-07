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
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { useAppDispatch } from '../../store';
import { setAuthMode } from '../../store/slices/authSlice';
import { CrewButton, Title, Subtitle } from '../../components/atoms';

const { height } = Dimensions.get('window');

const NotificationsScreen: React.FC = () => {
  const dispatch = useAppDispatch();

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

  useEffect(() => {
    return () => {
      dispatch(setAuthMode(null));
    };
  }, [dispatch]);

  const handleContinue = async () => {
    try {
      // Save notification preference to AsyncStorage
      await AsyncStorage.setItem('notificationsSet', 'true');
      console.log('Notifications preference saved');

      // No need to navigate - root navigator will handle this
      // based on AsyncStorage values
    } catch (error) {
      console.error('Error saving notification preference:', error);
      Alert.alert('Error', 'Failed to save your preference. Please try again.');
    }
  };

  const handleSkip = async () => {
    try {
      // Still save to AsyncStorage even when skipped
      await AsyncStorage.setItem('notificationsSet', 'true');
      console.log('Notifications preference saved (skipped)');

      // No need to navigate - root navigator will handle this
      // based on AsyncStorage values
    } catch (error) {
      console.error('Error saving notification preference:', error);
      Alert.alert('Error', 'Failed to save your preference. Please try again.');
    }
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
            <Title text="Turn on notifications" containerClassName="mb-4" />

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
