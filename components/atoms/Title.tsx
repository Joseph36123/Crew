// components/atoms/Title.tsx
import React from 'react';
import { Text, TextProps, View } from 'react-native';

interface TitleProps extends TextProps {
  text: string;
  align?: 'left' | 'center' | 'right';
  containerClassName?: string;
  textClassName?: string;
}

const Title: React.FC<TitleProps> = ({
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
          className={`font-cairo text-4xl font-bold text-[#0D0F0F] ${
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

export default Title;