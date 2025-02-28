// components/atoms/Subtitle.tsx
import React from 'react';
import { Text, TextProps, View } from 'react-native';

interface SubtitleProps extends TextProps {
  text: string;
  align?: 'left' | 'center' | 'right';
  containerClassName?: string;
  textClassName?: string;
}

const Subtitle: React.FC<SubtitleProps> = ({
  text,
  align = 'center',
  containerClassName = '',
  textClassName = '',
  ...textProps
}) => {
  // Split text by newline character if present
  const textLines = text.split('\n');

  return (
    <View className={`${containerClassName}`}>
      {textLines.map((line, index) => (
        <Text
          key={index}
          className={`font-cairo text-sm text-gray-500 ${
            align === 'center' ? 'text-center' : align === 'left' ? 'text-left' : 'text-right'
          } ${textClassName}`}
          {...textProps}
        >
          {line}
        </Text>
      ))}
    </View>
  );
};

export default Subtitle;