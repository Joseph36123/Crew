import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LoadingIndicatorProps {
  message?: string;
  color?: string;
  size?: 'small' | 'large';
  fullScreen?: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  message = 'Loading...',
  color = '#AAD3FF',
  size = 'large',
  fullScreen = false,
}) => {
  if (fullScreen) {
    return (
      <View className="absolute inset-0 z-50 flex-1 items-center justify-center bg-white bg-opacity-90">
        <View className="items-center rounded-2xl bg-white p-6 shadow-md">
          <ActivityIndicator size={size} color={color} />
          <Text className="mt-3 text-center font-cairo-medium text-gray-700">{message}</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="items-center justify-center py-10">
      <ActivityIndicator size={size} color={color} />
      {message && (
        <Text className="mt-2 text-center font-cairo-medium text-gray-700">{message}</Text>
      )}
    </View>
  );
};

export const PreferenceLoadingIndicator: React.FC<{
  type: 'vibes' | 'scenes' | 'hobbies';
  fullScreen?: boolean;
}> = ({ type, fullScreen = false }) => {
  // Custom loading message based on the type
  const getMessage = () => {
    switch (type) {
      case 'vibes':
        return 'Loading your vibes...';
      case 'scenes':
        return 'Finding your scenes...';
      case 'hobbies':
        return 'Discovering your hobbies...';
      default:
        return 'Loading...';
    }
  };

  const getIconName = () => {
    switch (type) {
      case 'vibes':
        return 'pulse';
      case 'scenes':
        return 'map';
      case 'hobbies':
        return 'basketball';
      default:
        return 'refresh';
    }
  };

  if (fullScreen) {
    return (
      <View className="absolute inset-0 z-50 flex-1 items-center justify-center bg-white bg-opacity-90">
        <View className="items-center rounded-2xl bg-white p-8 shadow-md">
          <Ionicons name={getIconName()} size={36} color="#AAD3FF" />
          <ActivityIndicator size="large" color="#AAD3FF" className="mt-3" />
          <Text className="mt-3 text-center font-cairo-medium text-base text-gray-700">
            {getMessage()}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="items-center justify-center py-14">
      <Ionicons name={getIconName()} size={32} color="#AAD3FF" />
      <ActivityIndicator size="large" color="#AAD3FF" className="mt-2" />
      <Text className="mt-2 text-center font-cairo-medium text-gray-700">{getMessage()}</Text>
    </View>
  );
};

export default LoadingIndicator;
