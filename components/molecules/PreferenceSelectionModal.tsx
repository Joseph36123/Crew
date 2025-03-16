import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PreferenceItem } from '../../services/profileService';
import { CrewButton } from '../../components/atoms';

interface PreferenceSelectionModalProps {
  title: string;
  visible: boolean;
  items: PreferenceItem[];
  selectedItems: string[];
  isLoading: boolean;
  onClose: () => void;
  onSave: () => void;
  onSelectItem: (itemId: string) => void;
  preferenceType: 'vibes' | 'scenes' | 'hobbies';
}

const PreferenceSelectionModal: React.FC<PreferenceSelectionModalProps> = ({
  title,
  visible,
  items,
  selectedItems,
  isLoading,
  onClose,
  onSave,
  onSelectItem,
  preferenceType,
}) => {
  const [searchText, setSearchText] = useState('');
  const [filteredItems, setFilteredItems] = useState<PreferenceItem[]>(items);
  const [isSearching, setIsSearching] = useState(false);
  const [imageLoadErrors, setImageLoadErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (items && visible) {
      setIsSearching(true);

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
    }
  }, [items, searchText, visible]);

  useEffect(() => {
    if (visible) {
      setSearchText('');
      setFilteredItems(items);
      setIsSearching(false);
    }
  }, [visible, items]);

  useEffect(() => {
    if (visible) {
      console.log('Modal items:', items);
      console.log('Modal selected items:', selectedItems);
    }
  }, [items, selectedItems, visible]);

  // Handle image load error
  const handleImageError = (itemId: string) => {
    setImageLoadErrors((prev) => ({
      ...prev,
      [itemId]: true,
    }));
    console.log(`Failed to load image for item in modal: ${itemId}`);
  };

  const getRandomColor = (id: string) => {
    const hash = id.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    const h = Math.abs(hash % 360);
    return `hsl(${h}, 70%, 40%)`;
  };

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

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContent}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>{title}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>

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

          {/* Selected Count */}
          <Text style={styles.selectedCountText}>
            {selectedItems.length} {preferenceType} selected
          </Text>

          {/* Grid of Items or Loading State */}
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
              style={styles.list}
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

          {/* Save Button */}
          <CrewButton
            variant="filled"
            text={`Add ${selectedItems.length > 0 ? `(${selectedItems.length})` : ''}`}
            color="secondary"
            size="large"
            fullWidth={true}
            onPress={onSave}
            loading={isLoading}
            disabled={isLoading || selectedItems.length === 0}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    height: '80%',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontFamily: 'Cairo_700Bold',
    fontSize: 24,
    color: '#0D0F0F',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    marginBottom: 12,
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
  selectedCountText: {
    fontFamily: 'Cairo_500Medium',
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 16,
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
    marginBottom: 8,
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
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
  searchingContainer: {
    flex: 1,
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsText: {
    fontFamily: 'Cairo_400Regular',
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
  },
});

export default PreferenceSelectionModal;
