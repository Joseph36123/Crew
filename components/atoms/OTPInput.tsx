// components/atoms/OTPInput.tsx
import React, { useRef, useState } from 'react';
import { View, TextInput } from 'react-native';

interface OTPInputProps {
  length: number;
  value: string[];
  onChange: (value: string[]) => void;
  containerClassName?: string;
  inputClassName?: string;
}

const OTPInput: React.FC<OTPInputProps> = ({
  length,
  value,
  onChange,
  containerClassName = '',
  inputClassName = '',
}) => {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleChange = (text: string, index: number) => {
    const newChar = text.slice(-1);
    const newOtp = [...value];
    newOtp[index] = newChar;
    onChange(newOtp);
    if (newChar && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  return (
    <View className={`flex-row justify-center space-x-4 ${containerClassName}`}>
      {Array.from({ length }).map((_, index) => {
        const isFocused = focusedIndex === index;
        return (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            value={value[index]}
            onChangeText={(text) => handleChange(text, index)}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(null)}
            keyboardType="number-pad"
            maxLength={1}
            className={`font-cairo h-16 w-16 rounded-md border text-center text-2xl ${
              isFocused || value[index] ? 'border-blue-500' : 'border-gray-400'
            } ${inputClassName}`}
          />
        );
      })}
    </View>
  );
};

export default OTPInput;