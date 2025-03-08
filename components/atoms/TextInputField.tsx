import React, { useState } from 'react';
import {
  View,
  TextInput,
  TextInputProps,
  Image,
  ImageSourcePropType,
  Platform,
  StyleSheet,
} from 'react-native';

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
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      className={`my-2.5 h-[56px] w-full justify-center rounded-full bg-white px-6 ${
        isFocused ? 'border-2 border-blue-500' : 'border border-gray-300'
      } ${containerClassName}`}>
      <View className="h-full flex-row items-center">
        <TextInput
          className={`flex-1 font-cairo text-base text-black ${inputClassName}`}
          placeholderTextColor="#A0A0A0"
          textAlign="left"
          style={styles.input}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...textInputProps}
        />
        {icon && (
          <View className="ml-2">
            <Image source={icon} className="h-6 w-6" resizeMode="contain" />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: '100%',
    textAlignVertical: 'center',

    ...Platform.select({
      ios: {
        lineHeight: 22,
        paddingTop: 0,
        paddingBottom: 0,
      },
      android: {
        paddingTop: 0,
        paddingBottom: 0,
        includeFontPadding: false,
      },
    }),
  },
});

export default TextInputField;
