import { Text, View, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppDispatch } from '../store';
import { logout } from '../store/slices/authSlice';
import { CommonActions, useNavigation } from '@react-navigation/native';

export const EditScreenInfo = ({ path }: { path: string }) => {
  const title = 'Open up the code for this screen:';
  const description =
    'Change any of the text, save the file, and your app will automatically update.';

  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        onPress: async () => {
          try {
            console.log('Logging out user...');

            // Use the existing logout action which already handles removing auth tokens
            await dispatch(logout());

            await AsyncStorage.multiRemove(['profileCompleted', 'termsAccepted']);

            console.log('Logout successful, cleared profile and terms flags');

            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Auth' }],
              })
            );
          } catch (error) {
            console.error('Logout error:', error);
            Alert.alert('Error', 'Failed to log out. Please try again.');
          }
        },
        style: 'destructive',
      },
    ]);
  };

  return (
    <View>
      <View className={styles.getStartedContainer}>
        <Text className={styles.getStartedText}>{title}</Text>
        <View className={`${styles.codeHighlightContainer} ${styles.homeScreenFilename}`}>
          <Text>{path}</Text>
        </View>
        <Text className={styles.getStartedText}>{description}</Text>

        {/* Logout Button */}
        <TouchableOpacity className="mt-8 rounded-lg bg-red-500 px-6 py-3" onPress={handleLogout}>
          <Text className="text-center text-base font-medium text-white">Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = {
  codeHighlightContainer: `rounded-md px-1`,
  getStartedContainer: `items-center mx-12`,
  getStartedText: `text-lg leading-6 text-center`,
  helpContainer: `items-center mx-5 mt-4`,
  helpLink: `py-4`,
  helpLinkText: `text-center`,
  homeScreenFilename: `my-2`,
};
