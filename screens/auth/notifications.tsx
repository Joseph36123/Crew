import React, { useEffect } from 'react';
import {
  View,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Alert,
  BackHandler,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { useAppDispatch, useAppSelector } from '../../store';
import { CrewButton, Title, Subtitle } from '../../components/atoms';

const { height } = Dimensions.get('window');

const NotificationsScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isProfileComplete } = useAppSelector((state) => state.profile);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      return true;
    });

    return () => backHandler.remove();
  }, []);

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
    const showNotificationDialog = async () => {
      const permission = await requestNotificationsPermission();
      console.log('Notification permission granted:', permission);
    };

    const timer = setTimeout(() => {
      showNotificationDialog();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleContinue = async () => {
    try {
      await AsyncStorage.setItem('notificationsSet', 'true');
      console.log('Notifications preference saved - user allowed notifications');

      Alert.alert('Success', 'Notification preferences saved successfully!', [
        {
          text: 'Continue',
          onPress: async () => {
            await AsyncStorage.setItem('navigationReady', 'true');
          },
        },
      ]);
    } catch (error) {
      console.error('Error saving notification preference:', error);
      Alert.alert('Error', 'Failed to save your preference. Please try again.');
    }
  };

  const handleSkip = async () => {
    try {
      await AsyncStorage.setItem('notificationsSet', 'true');
      console.log('Notifications preference saved (skipped)');

      Alert.alert('Success', 'Preferences saved successfully!', [
        {
          text: 'Continue',
          onPress: async () => {
            await AsyncStorage.setItem('navigationReady', 'true');
          },
        },
      ]);
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
