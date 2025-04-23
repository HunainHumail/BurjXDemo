import {create} from 'zustand';
import {
    checkAvailability,
    authenticate,
    BiometricEnums,
  } from "react-native-simple-biometric";

interface AuthState {
  biometricAvailable: boolean;
  isAuthenticated: boolean;
  checkBiometricAvailability: () => Promise<void>;
  authenticate: (
    promptTitle?: string,
    promptMessage?: string
  ) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set) => ({
  biometricAvailable: false,
  isAuthenticated: false,

  checkBiometricAvailability: async () => {
    try {
      const available = await checkAvailability();
      set({ biometricAvailable: available });
    } catch {
      set({ biometricAvailable: false });
    }
  },

  authenticate: async (
    promptTitle = 'Authenticate',
    promptMessage = 'Use your biometrics to login'
  ) => {
    try {
      await authenticate();
      set({ isAuthenticated: true });
      return true;
    } catch {
      set({ isAuthenticated: false });
      return false;
    }
  },
}));
