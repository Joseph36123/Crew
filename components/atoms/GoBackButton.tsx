// components/atoms/GoBackButton.tsx
import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface GoBackButtonProps extends TouchableOpacityProps {
  onPress: () => void;
  text?: string;
  buttonClassName?: string;
  textClassName?: string;
}

const GoBackButton: React.FC<GoBackButtonProps> = ({
  onPress,
  text = 'Go back',
  buttonClassName = '',
  textClassName = '',
  ...touchableProps
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`p-2 ${buttonClassName}`}
      {...touchableProps}
    >
      <Text
        className={`font-cairo text-sm text-center text-black ${textClassName}`}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default GoBackButton;