// components/atoms/OTPInput.tsx
import React, { useRef, useState, useEffect } from 'react';
import { View, TextInput, Clipboard, Platform } from 'react-native';

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

  // Check clipboard for auto-fill on focus of first input
  useEffect(() => {
    const checkClipboard = async () => {
      try {
        const clipboardContent = await Clipboard.getString();

        // Check if clipboard content is numeric and matches OTP length
        if (/^\d+$/.test(clipboardContent) && clipboardContent.length === length) {
          const otpArray = clipboardContent.split('').slice(0, length);
          onChange(otpArray);
        }
      } catch (error) {
        console.log('Failed to read clipboard', error);
      }
    };

    // Only check clipboard when first input is focused
    if (focusedIndex === 0) {
      checkClipboard();
    }
  }, [focusedIndex, length, onChange]);

  const handleChange = (text: string, index: number) => {
    // Handle paste event (when multiple characters are pasted)
    if (text.length > 1) {
      // Split the text into individual characters
      const chars = text.split('');
      const newOtp = [...value];

      // Fill as many OTP boxes as we can
      for (let i = 0; i < length && i < chars.length; i++) {
        if (/^\d$/.test(chars[i])) {
          // Ensure it's a digit
          newOtp[index + i] = chars[i];
        }
      }

      onChange(newOtp);

      // Focus the appropriate input
      const nextIndex = Math.min(index + chars.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    // Normal single character input
    const newChar = text.slice(-1);
    if (newChar && !/^\d$/.test(newChar)) return; // Only allow digits

    const newOtp = [...value];
    newOtp[index] = newChar;
    onChange(newOtp);

    // Auto-advance to next input if a character was entered
    if (newChar && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace to go to previous input
  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
      // If current input is empty and backspace is pressed, go to previous input
      inputRefs.current[index - 1]?.focus();
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
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="number-pad"
            maxLength={length} // Allow pasting full OTP
            textAlign="center"
            textAlignVertical="center"
            selectTextOnFocus
            className={`h-16 w-16 rounded-md border text-center font-cairo text-2xl ${
              isFocused || value[index] ? 'border-blue-500' : 'border-gray-400'
            } ${inputClassName}`}
            style={{
              lineHeight: Platform.OS === 'android' ? 24 : undefined,
              paddingTop: 0,
              paddingBottom: 0,
            }}
          />
        );
      })}
    </View>
  );
};

export default OTPInput;
