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

// Updated authStore.ts
export const useAuthStore = create<AuthState>((set) => ({
  biometricAvailable: false,
  isAuthenticated: false,

  checkBiometricAvailability: async () => {
    try {
      const available = await checkAvailability();
      set({ biometricAvailable: available !== BiometricEnums.None });
    } catch {
      set({ biometricAvailable: false });
    }
  },

  authenticate: async () => { // Remove unused parameters
    try {
      const success = await authenticate(); // Actual library call
      set({ isAuthenticated: success });
      return success;
    } catch {
      set({ isAuthenticated: false });
      return false;
    }
  },
}));