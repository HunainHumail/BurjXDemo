import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RNBootSplash from 'react-native-bootsplash';
import AuthScreen from '../screens/AuthScreen';
import MarketScreen from '../screens/MarketScreen';
import CoinDetails from '../screens/CoinDetails';
import { useTheme } from '../themes/useTheme';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const { colors } = useTheme();

  const handleAuthSuccess = () => {
    RNBootSplash.hide({ fade: true });
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
      }}
    >
      <Stack.Screen
        name="Auth"
        options={{ headerShown: false }}
      >
        {(props) => <AuthScreen {...props} onSuccess={handleAuthSuccess} />}
      </Stack.Screen>
      <Stack.Screen
        name="Market"
        component={MarketScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CoinDetails"
        component={CoinDetails}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};