# React Native Application

This is a React Native project that strictly follows a scalable, modular, and organized architecture. The UI has been developed to match the provided Figma designs **exactly**, ensuring a pixel-perfect and consistent user experience across devices.

---

## 📁 Project Structure

```
project-root/
├── App.tsx                 # Entry point (moved to root for better clarity)
└── src/
    ├── assets/             # Fonts, icons, and images used across the app
    │   ├── fonts/
    │   ├── icons/
    │   └── images/
    ├── components/         # Reusable UI components
    │   ├── AppButton.tsx
    │   ├── CardWrapper.tsx
    │   └── ... (other components)
    ├── constants/          # App constants (images, static values)
    │   └── images.ts
    ├── navigation/         # App's navigation configuration
    │   └── AppNavigator.tsx
    ├── screens/            # Screen-specific components
    │   ├── AuthScreen/
    │   ├── CoinDetails/
    │   └── MarketScreen/
    ├── stores/             # Global state management (using Zustand)
    │   ├── authStore.ts
    │   └── marketStore.ts
    ├── themes/             # Centralized theme and styling
    │   ├── theme.ts
    │   └── userTheme.ts
    └── utils/              # Utility/helper functions
        ├── helpers.ts
        └── NavigationService.ts
```

---

## ⚙️ Why This Directory Structure?

- **Separation of Concerns**: All features and utilities are divided cleanly (screens, components, stores, navigation, themes, etc.).
- **Scalability**: Easy to maintain and scale as the app grows.
- **Reusability**: Components and utilities are organized for maximum reusability.
- **Clarity**: `App.tsx` is at the project root, making it easier to locate the main entry point.
- **Consistency**: Assets, constants, and themes are centralized for a uniform design system across the app.

---

## 🚀 How to Run the Application

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project-root
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

3. **Apply `patch-package` patches**

   We use `patch-package` to fix some library issues.  
   Before running the app, apply all patches:
   ```bash
   npx patch-package
   ```

4. **Run on Android**
   ```bash
   npx react-native run-android
   ```

5. **Run on iOS** (Mac only)
   ```bash
   cd ios
   pod install
   cd ..
   npx react-native run-ios
   ```

---

## 🛠 Special Notes

- **Biometric Authentication**:  
  We are using [`react-native-simple-biometric`](https://github.com/mjdev/react-native-simple-biometric) for biometric authentication.
  
  - The native **Android** implementation from the library was **not functioning correctly**.
  - I have **updated and patched** the native Kotlin code to fix biometric authentication issues on Android devices.
  - This patch is automatically applied when running `npx patch-package`, so you don't need to manually modify the library code.

- **UI Implementation**:  
  The application strictly follows the UI/UX designs provided in **Figma**, ensuring a clean, consistent, and professional look throughout.

---

## 📦 Dependencies Highlight

- React Native
- Zustand (for state management)
- React Navigation
- patch-package
- react-native-simple-biometric (with native Android patch)
- Styled theming (centralized theme management)

---

## 📄 Conclusion

This project is structured to be **scalable**, **easy to navigate**, and **developer-friendly**. It follows **industry best practices** and has been tailored to closely match the design specifications provided.
