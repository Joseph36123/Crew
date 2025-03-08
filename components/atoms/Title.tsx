import React from 'react';
import { Text, TextProps, View, StyleSheet, Platform } from 'react-native';

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
  const processedText = text.replace(/\\n/g, '\n');
  const textLines = processedText.split('\n');

  return (
    <View className={`${containerClassName}`}>
      {textLines.map((line, index) => (
        <Text
          key={index}
          className={`font-cairo text-4xl font-bold text-[#0D0F0F] ${
            align === 'center' ? 'text-center' : align === 'left' ? 'text-left' : 'text-right'
          } ${textClassName}`}
          style={styles.text}
          {...textProps}>
          {line}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    lineHeight: Platform.OS === 'ios' ? 40 : 42,
    includeFontPadding: false,
    ...Platform.select({
      ios: {
        paddingTop: 1,
        paddingBottom: 1,
      },
      android: {
        paddingTop: 2,
        paddingBottom: 1,
      },
    }),
  },
});

export default Title;
