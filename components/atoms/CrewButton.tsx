import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Foundation from 'react-native-vector-icons/Foundation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Zocial from 'react-native-vector-icons/Zocial';
import { CrewButtonProps, IconFamily } from '../../types/button';

const IconComponents = {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  FontAwesome5,
  Fontisto,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
  SimpleLineIcons,
  Zocial,
};

const CrewButton: React.FC<CrewButtonProps> = ({
  variant = 'filled',
  onPress,
  disabled = false,
  loading = false,
  iconName,
  iconFamily = 'MaterialIcons',
  color = 'primary',
  text,
  size = 'medium',
  fullWidth = true,
  className = '',
  iconPosition = 'left',
}) => {
  // Helper function to get the actual color value
  const getColorValue = (colorName: string) => {
    const colorMap: { [key: string]: string } = {
      primary: '#191919',
      'primary-light': '#232323',
      'primary-dark': '#000000',
      secondary: '#AAD3FF',
      'secondary-light': '#D6E9FF',
      'secondary-dark': '#7AB8FF',
      success: '#4CAF50',
      error: '#F44336',
      warning: '#FFC107',
      info: '#2196F3',
      gray: '#9E9E9E',
      white: '#FFFFFF',
    };
    return colorMap[colorName] || colorName;
  };

  const getBaseStyles = () => {
    const baseStyles = 'rounded-full flex flex-row items-center justify-center my-4';
    const sizeStyles = {
      small: 'px-4 py-2',
      medium: 'px-6 py-3',
      large: 'px-8 py-4',
    };
    const widthStyle = fullWidth ? 'w-full' : 'w-auto';

    return `${baseStyles} ${sizeStyles[size]} ${widthStyle} ${className}`;
  };

  const getVariantStyles = () => {
    const currentColor = getColorValue(color);

    const styles = {
      filled: {
        backgroundColor: currentColor,
        borderWidth: 0,
      },
      outlined: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: currentColor,
      },
      text: {
        backgroundColor: 'transparent',
        borderWidth: 0,
      },
      icon: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        padding: 8,
      },
    };

    return styles[variant];
  };

  const getTextColor = () => {
    if (variant === 'filled') {
      return '#191919';
    }
    return getColorValue(color);
  };

  const getIconSize = () => {
    const sizes = {
      small: 16,
      medium: 20,
      large: 24,
    };
    return sizes[size];
  };

  // const renderIcon = () => {
  //   if (!iconName) return null;

  //   const IconComponent = IconComponents[iconFamily];
  //   return (
  //     <IconComponent
  //       name={iconName}
  //       size={getIconSize()}
  //       color={getTextColor()}
  //       style={text ? (iconPosition === 'left' ? { marginRight: 8 } : { marginLeft: 8 }) : {}}
  //     />
  //   );
  // };

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator color={getTextColor()} />;
    }

    const textStyles = {
      color: getTextColor(),
      opacity: disabled ? 0.5 : 1,
      fontSize: size === 'small' ? 14 : size === 'large' ? 18 : 16,
      fontWeight: '500' as const,
    };

    const buttonText = variant !== 'icon' && text && <Text style={textStyles}>{text}</Text>;

    return <>{buttonText}</>;
  };

  return (
    <TouchableOpacity
      onPress={!disabled && !loading ? onPress : undefined}
      style={[getVariantStyles(), { opacity: disabled ? 0.5 : 1 }]}
      className={getBaseStyles()}
      activeOpacity={disabled ? 1 : 0.8}>
      {renderContent()}
    </TouchableOpacity>
  );
};

export default CrewButton;
