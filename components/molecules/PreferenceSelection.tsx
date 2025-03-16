import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProfileSetupStackParamList } from '../../types/types';
import { ProfileHeader, ProfileContainer } from '../../components/molecules';
import { PreferenceItem } from '../../services/profileService';
import { CrewButton } from '../../components/atoms';

interface PreferenceSelectionProps {
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

const PreferenceSelection: React.FC<PreferenceSelectionProps> = ({
  title,
  subtitle,
  items,
  selectedItems,
  isLoading,
  onSelectItem,
  onContinue,
  nextScreenName,
  preferenceType,
}) => {
  const navigation = useNavigation<StackNavigationProp<ProfileSetupStackParamList>>();

  const [searchText, setSearchText] = useState('');
  const [filteredItems, setFilteredItems] = useState<PreferenceItem[]>(items);
  const [isSearching, setIsSearching] = useState(false);
  const [imageLoadErrors, setImageLoadErrors] = useState<Record<string, boolean>>({});

  // Update filtered items when items change or search text changes
  useEffect(() => {
    if (items && items.length > 0) {
      setIsSearching(true);

      // Add a slight delay to make the loading state visible
      const timer = setTimeout(() => {
        if (searchText) {
          setFilteredItems(
            items.filter((item) => item.title.toLowerCase().includes(searchText.toLowerCase()))
          );
        } else {
          setFilteredItems(items);
        }
        setIsSearching(false);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setFilteredItems([]);
    }
  }, [items, searchText]);

  // For debugging
  useEffect(() => {
    console.log('Items received in PreferenceSelection:', items);
    console.log('Selected items:', selectedItems);
  }, [items, selectedItems]);

  // Handle continue button press
  const handleContinue = () => {
    if (selectedItems.length === 0) {
      Alert.alert(
        'Selection Required',
        `Please select at least one ${preferenceType.slice(0, -1)} to continue`
      );
      return;
    }

    // Call the parent's onContinue function
    onContinue();

    // Navigate to the next screen
    navigation.navigate(nextScreenName);
  };

  // Handle image load error
  const handleImageError = (itemId: string) => {
    setImageLoadErrors((prev) => ({
      ...prev,
      [itemId]: true,
    }));
    console.log(`Failed to load image for item: ${itemId}`);
  };

  // Render each item
  const renderItem = ({ item }: { item: PreferenceItem }) => {
    const isSelected = selectedItems.includes(item._id);
    const hasImageError = imageLoadErrors[item._id];

    return (
      <TouchableOpacity
        style={[styles.itemContainer, isSelected && styles.selectedItem]}
        onPress={() => onSelectItem(item._id)}
        activeOpacity={0.7}>
        {hasImageError ? (
          <View style={[styles.placeholderImage, { backgroundColor: getRandomColor(item._id) }]}>
            <Text style={styles.placeholderText}>{item.title.charAt(0).toUpperCase()}</Text>
          </View>
        ) : (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.itemImage}
            resizeMode="cover"
            onError={() => handleImageError(item._id)}
          />
        )}
        <View style={styles.itemOverlay}>
          <Text style={styles.itemText}>{item.title.toUpperCase()}</Text>
        </View>

        {/* Selection Indicator */}
        {isSelected && (
          <View style={styles.selectionIndicator}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // Generate a random background color based on the item ID
  const getRandomColor = (id: string) => {
    // Generate a consistent color based on the ID
    const hash = id.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    const h = Math.abs(hash % 360);
    return `hsl(${h}, 70%, 40%)`;
  };

  // If no items are available yet, show a loading placeholder
  if (items.length === 0 && isLoading) {
    return (
      <View style={styles.container}>
        <ProfileHeader />
        <ProfileContainer>
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.subtitleText}>{subtitle}</Text>

          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#AAD3FF" />
            <Text style={styles.loadingText}>Loading {preferenceType}...</Text>
          </View>
        </ProfileContainer>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ProfileHeader />

      <ProfileContainer>
        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.subtitleText}>{subtitle}</Text>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#999"
          />
        </View>

        {/* Items Grid or Loading Indicator */}
        {isSearching ? (
          <View style={styles.searchingContainer}>
            <ActivityIndicator size="small" color="#AAD3FF" />
            <Text style={styles.searchingText}>Searching...</Text>
          </View>
        ) : filteredItems.length > 0 ? (
          <FlatList
            data={filteredItems}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            numColumns={2}
            columnWrapperStyle={styles.itemRow}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>
              No {preferenceType} found matching "{searchText}"
            </Text>
          </View>
        )}

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <CrewButton
            variant="filled"
            text="Continue"
            color="secondary"
            size="large"
            fullWidth={true}
            onPress={handleContinue}
            loading={isLoading}
            disabled={selectedItems.length === 0 || isLoading}
          />
        </View>
      </ProfileContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  titleText: {
    fontFamily: 'Cairo_700Bold',
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0D0F0F',
    marginTop: 5,
    marginBottom: 5,
  },
  subtitleText: {
    fontFamily: 'Cairo_400Regular',
    fontSize: 16,
    color: '#777',
    marginBottom: 16,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 20,
    fontFamily: 'Cairo_400Regular',
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  itemRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  itemContainer: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 10,
  },
  selectedItem: {
    borderWidth: 3,
    borderColor: '#AAD3FF',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  itemOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  itemText: {
    fontFamily: 'Cairo_700Bold',
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  selectionIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#AAD3FF',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  checkmark: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontFamily: 'Cairo_500Medium',
    fontSize: 16,
    color: '#555',
  },
  searchingContainer: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchingText: {
    marginTop: 8,
    fontFamily: 'Cairo_400Regular',
    fontSize: 14,
    color: '#555',
  },
  noResultsContainer: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsText: {
    fontFamily: 'Cairo_400Regular',
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
});

export default PreferenceSelection;
