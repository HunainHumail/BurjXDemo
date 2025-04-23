// src/stores/auth.store.ts
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

  // 1️⃣ Detect hardware / permission
  checkBiometricAvailability: async () => {
    try {
      const available = await checkAvailability();
      set({ biometricAvailable: available });
    } catch {
      set({ biometricAvailable: false });
    }
  },

  // 2️⃣ Prompt the native biometric dialog
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
