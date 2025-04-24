const IMAGES = {
    biometricLogo: require('../assets/images/biometric-image.png'),
    bannerBlur: require('../assets/images/banner-blur.png'),
    banner: require('../assets/images/Banner.png'),

    // Add more images as needed
  };
  
  export type ImageKey = keyof typeof IMAGES;
  export default IMAGES;
  
  export const BiometricLogo = IMAGES.biometricLogo;
  export const BannerBlur = IMAGES.bannerBlur;
  export const Banner = IMAGES.banner;