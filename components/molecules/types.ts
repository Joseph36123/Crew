import { PreferenceItem, ProfileSetupStackParamList } from 'types/types';

export interface PreferenceSelectionProps {
  title: string;
  subtitle: string;
  items: PreferenceItem[];
  selectedItems: string[];
  isLoading: boolean;
  onSelectItem: (itemId: string) => void;
  onContinue: () => void;
  nextScreenName: keyof ProfileSetupStackParamList;
  preferenceType: 'vibes' | 'scenes' | 'hobbies';
}
