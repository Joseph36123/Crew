export type ButtonVariant = 'filled' | 'outlined' | 'text' | 'icon';

// Adding IconFamily type to support different icon families from react-native-vector-icons
export type IconFamily =
  | 'AntDesign'
  | 'Entypo'
  | 'EvilIcons'
  | 'Feather'
  | 'FontAwesome'
  | 'FontAwesome5'
  | 'Fontisto'
  | 'Foundation'
  | 'Ionicons'
  | 'MaterialCommunityIcons'
  | 'MaterialIcons'
  | 'Octicons'
  | 'SimpleLineIcons'
  | 'Zocial';

export interface CrewButtonProps {
  variant?: ButtonVariant;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  iconName?: string;
  iconFamily?: IconFamily;
  color?: string;
  text?: string;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  className?: string;
  iconPosition?: 'left' | 'right';
}
