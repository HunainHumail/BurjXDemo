// App.tsx
import { NavigationContainer } from '@react-navigation/native';
import RNBootSplash from 'react-native-bootsplash';
import { AppNavigator } from './navigation/AppNavigator';
import { SafeAreaView } from 'react-native';
import { colors } from './themes/theme';
import { navigationRef } from './utils/NavigationService';

export default function App() {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.background}}>
      <NavigationContainer ref={navigationRef}>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaView>
  );
}