import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  SafeAreaView,
  StatusBar,
  TextStyle,
} from 'react-native';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { PhoneInputFieldProps } from 'types/types';
import { countries } from 'utils/utils';

const PhoneInputField: React.FC<PhoneInputFieldProps> = ({
  value,
  onChangeText,
  onValidChange,
  containerClassName = '',
  placeholder = 'Phone Number',
  defaultCode = 'US',
}) => {
  // Find default country
  const defaultCountry = countries.find((country) => country.code === defaultCode) || countries[0];

  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
  const [phoneNumber, setPhoneNumber] = useState(value || '');
  const [isFocused, setIsFocused] = useState(false);
  const [touched, setTouched] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const inputRef = useRef<TextInput>(null);
  const searchInputRef = useRef<TextInput>(null);

  const getFilteredCountries = () => {
    if (!searchQuery) return countries;

    const query = searchQuery.toLowerCase();
    return countries.filter(
      (country) =>
        country.name.toLowerCase().includes(query) ||
        country.dialCode.includes(query) ||
        country.code.toLowerCase().includes(query)
    );
  };

  // Validate the phone number
  const validatePhoneNumber = (number: string, dialCode: string) => {
    if (!number || number.length === 0) {
      setIsValid(true);
      setValidationMessage('');
      return true;
    }

    try {
      const formattedNumber = `${dialCode}${number}`;
      const valid = isValidPhoneNumber(formattedNumber);

      if (!valid) {
        setIsValid(false);
        setValidationMessage(`Invalid phone number for ${selectedCountry.name}`);

        if (onValidChange) {
          onValidChange(false);
        }
        return false;
      } else {
        setIsValid(true);
        setValidationMessage('');

        if (onValidChange) {
          onValidChange(true);
        }
        return true;
      }
    } catch (error) {
      console.log('Phone validation error:', error);
      setIsValid(false);
      setValidationMessage('Please enter a valid phone number');

      if (onValidChange) {
        onValidChange(false);
      }
      return false;
    }
  };

  // Handle phone number changes
  const handlePhoneNumberChange = (text: string) => {
    setPhoneNumber(text);
    setTouched(true);

    const formattedNumber = `${selectedCountry.dialCode}${text}`;

    // Validate and notify parent
    validatePhoneNumber(text, selectedCountry.dialCode);
    onChangeText(text, formattedNumber);
  };

  // Handle country selection
  const handleCountrySelect = (country: (typeof countries)[0]) => {
    setSelectedCountry(country);
    setIsPickerVisible(false);

    const formattedNumber = `${country.dialCode}${phoneNumber}`;

    // Validate with new country code
    validatePhoneNumber(phoneNumber, country.dialCode);

    // Notify parent component
    onChangeText(phoneNumber, formattedNumber);

    // Focus the input after selecting a country
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  return (
    <View className={containerClassName}>
      <View
        className={`my-2.5 w-full flex-row items-center overflow-hidden rounded-full ${
          !isValid && touched
            ? 'border-2 border-red-500'
            : isFocused
              ? 'border-2 border-blue-500'
              : 'border border-gray-300'
        }`}
        style={styles.containerMain}>
        {/* Country Code Selector */}
        <TouchableOpacity
          style={styles.countrySelector}
          onPress={() => {
            setIsPickerVisible(true);
            setSearchQuery('');
          }}
          activeOpacity={0.7}>
          <Text style={styles.flagText}>{selectedCountry.flag}</Text>
          <Text style={styles.codeText}>{selectedCountry.dialCode}</Text>
          <View style={styles.divider} />
        </TouchableOpacity>

        {/* Phone Number Input */}
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={phoneNumber}
          onChangeText={handlePhoneNumberChange}
          placeholder={placeholder}
          placeholderTextColor="#A0A0A0"
          selectionColor="#0000FF"
          keyboardType="phone-pad"
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            setTouched(true);
            validatePhoneNumber(phoneNumber, selectedCountry.dialCode);
          }}
        />
      </View>

      {/* Validation message */}
      {!isValid && touched && validationMessage ? (
        <Text className="mt-1 font-cairo text-xs text-red-500">{validationMessage}</Text>
      ) : null}

      {/* Country Picker Modal */}
      <Modal
        visible={isPickerVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setIsPickerVisible(false)}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.pickerHeader}>
            <TouchableOpacity onPress={() => setIsPickerVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Select Country</Text>
          </View>

          {/* Search Input */}
          <View style={styles.searchContainer}>
            <TextInput
              ref={searchInputRef}
              style={styles.searchInput}
              placeholder="Search countries..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              clearButtonMode="while-editing"
              autoFocus
            />
          </View>

          {/* Countries List */}
          <FlatList
            data={getFilteredCountries()}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.countryItem}
                onPress={() => handleCountrySelect(item)}>
                <Text style={styles.countryFlag}>{item.flag}</Text>
                <Text style={styles.countryName}>{item.name}</Text>
                <Text style={styles.countryDialCode}>{item.dialCode}</Text>
              </TouchableOpacity>
            )}
            initialNumToRender={20}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const textStyle: TextStyle = {
  fontFamily: 'Cairo_400Regular',
  color: '#000000',
};

const styles = StyleSheet.create({
  containerMain: {
    height: 56,
    backgroundColor: 'white',
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: '100%',
  },
  flagText: {
    ...textStyle,
    fontSize: 16,
    marginRight: 5,
  },
  codeText: {
    ...textStyle,
    fontSize: 16,
  },
  divider: {
    width: 1,
    height: '50%',
    backgroundColor: '#CCCCCC',
    marginHorizontal: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    ...textStyle,
    ...Platform.select({
      ios: {
        paddingTop: 0,
        paddingBottom: 0,
      },
      android: {
        paddingTop: 0,
        paddingBottom: 0,
      },
    }),
  },
  modalContainer: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: 'white',
  },
  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  closeButton: {
    position: 'absolute',
    left: 15,
    zIndex: 1,
  },
  closeText: {
    fontSize: 16,
    color: '#007BFF',
    ...textStyle,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    ...textStyle,
  },
  searchContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchInput: {
    height: 40,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    paddingHorizontal: 15,
    ...textStyle,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  countryFlag: {
    fontSize: 22,
    marginRight: 15,
  },
  countryName: {
    ...textStyle,
    fontSize: 16,
    flex: 1,
  },
  countryDialCode: {
    ...textStyle,
    fontSize: 16,
    color: '#666666',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
  },
});

export default PhoneInputField;
