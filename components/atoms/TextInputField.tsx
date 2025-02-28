// components/atoms/TextInputField.tsx
import React from 'react';
import { View, TextInput, TextInputProps, Image, ImageSourcePropType } from 'react-native';

interface TextInputFieldProps extends TextInputProps {
  icon?: ImageSourcePropType;
  containerClassName?: string;
  inputClassName?: string;
}

const TextInputField: React.FC<TextInputFieldProps> = ({
  icon,
  containerClassName = '',
  inputClassName = '',
  ...textInputProps
}) => {
  return (
    <View className={`my-2.5 h-[50px] w-full justify-center rounded-full border border-gray-500 bg-white px-4 ${containerClassName}`}>
      <View className="flex-row items-center justify-between">
        <TextInput
          className={`font-cairo flex-1 text-sm text-black ${inputClassName}`}
          placeholderTextColor="#C2C2C2"
          {...textInputProps}
        />
        {icon && (
          <Image
            source={icon}
            className="h-6 w-6"
            resizeMode="contain"
          />
        )}
      </View>
    </View>
  );
};

export default TextInputField;