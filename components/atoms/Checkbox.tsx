// components/atoms/Checkbox.tsx
import React from 'react';
import { View, Text, Pressable, PressableProps } from 'react-native';

interface CheckboxProps extends Omit<PressableProps, 'style'> {
  checked: boolean;
  label: string;
  containerClassName?: string;
  checkboxClassName?: string;
  labelClassName?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  label,
  onPress,
  containerClassName = '',
  checkboxClassName = '',
  labelClassName = '',
  ...pressableProps
}) => {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center ${containerClassName}`}
      {...pressableProps}
    >
      <View
        className={`mr-2 h-6 w-6 items-center justify-center rounded-sm border border-[#AAD3FF] ${
          checked ? 'bg-[#AAD3FF]' : 'bg-white'
        } ${checkboxClassName}`}
      />
      <Text className={`font-cairo text-sm text-[#0D0F0F] ${labelClassName}`}>{label}</Text>
    </Pressable>
  );
};

export default Checkbox;