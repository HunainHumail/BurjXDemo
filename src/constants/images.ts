// src/assets/images/Images.ts
const IMAGES = {
    biometricLogo: require('../assets/images/biometric-image.png'),
    // Add more images as needed
  };
  
  export type ImageKey = keyof typeof IMAGES;
  export default IMAGES;
  
  // Optional: Individual exports for direct access
  export const BiometricLogo = IMAGES.biometricLogo;