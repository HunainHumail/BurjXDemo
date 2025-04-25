// src/screens/AuthScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Image, Alert, Linking, Platform, TouchableOpacity } from 'react-native';
import { BiometricLogo } from '../../constants/images';
import AppButton from '../../components/AppButton';
import styles from './styles';
import { useAuthStore } from '../../stores/authStore';
import NavigationService from '../../utils/NavigationService';

const AuthScreen: React.FC = () => {
    const {
        biometricAvailable,
        isAuthenticated,
        checkBiometricAvailability,
        authenticate,
    } = useAuthStore();

    const [error, setError] = useState<string | null>(null);

    // Detect hardware/enrollment on mount
    useEffect(() => {
        checkBiometricAvailability();
    }, [checkBiometricAvailability]);

    const setupBiometrics = () => {
        Alert.alert(
            'Biometric Not Configured',
            'Please enable Face ID / Fingerprint in your device settings to continue.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Open Settings',
                    onPress: () => {
                        Linking.openSettings().catch(() => {
                            if (Platform.OS === 'ios') {
                                Linking.openURL('App-Prefs:root=TOUCHID_PASSCODE');
                            }
                        });
                    },
                },
            ],
            { cancelable: true }
        );
    };

    const handleAuthorize = async () => {
        const success = await authenticate(
            'Login to CryptoApp',
            'Please confirm your identity'
        );
        if (!success) {
            setError('Authentication failed');
            Alert.alert('Error', 'Authentication failed');
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            NavigationService.reset('Market');
        }
    }, [isAuthenticated]);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Use Biometric to log in?</Text>
            <TouchableOpacity
                onPress={biometricAvailable ? handleAuthorize : setupBiometrics}
            ><Image source={BiometricLogo} style={styles.image} /></TouchableOpacity>
            {error && <Text style={styles.errorText}>{error}</Text>}

            <AppButton
                text={biometricAvailable ? 'Authorize' : 'Set Up'}
                onPress={biometricAvailable ? handleAuthorize : setupBiometrics}
            />
        </View>
    );
};

export default AuthScreen;
