const IMAGES = {
    biometricLogo: require('../assets/images/biometric-image.png'),
    // Add more images as needed
  };
  
  export type ImageKey = keyof typeof IMAGES;
  export default IMAGES;
  
  export const BiometricLogo = IMAGES.biometricLogo;