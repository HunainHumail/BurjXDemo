import Search from '../assets/icons/search.svg';
import Back from '../assets/icons/icon-back.svg';
import LineChart from '../assets/icons/chart-line.svg';
import CandleChart from '../assets/icons/chart-candlestick.svg';
import DropDownIcon from '../assets/icons/chevron-down.svg'
import X from '../assets/icons/x.svg'

const IMAGES = {
    biometricLogo: require('../assets/images/biometric-image.png'),
    bannerBlur: require('../assets/images/banner-blur.png'),
    banner: require('../assets/images/Banner.png'),
    // Add more images as needed
  };

  const SVGS = {
    searchIcon: Search,
    backIcon: Back,
    lineChartIcon: LineChart,
    candleChartIcon: CandleChart,
    dropDownIcon: DropDownIcon,
    xIcon: X
  }
  
  export type ImageKey = keyof typeof IMAGES;
  export default IMAGES;
  

  //IMAGE EXPORT
  export const BiometricLogo = IMAGES.biometricLogo;
  export const BannerBlur = IMAGES.bannerBlur;
  export const Banner = IMAGES.banner;


  //SVG EXPORT
  export const SeachIcon = SVGS.searchIcon
  export const BackIcon = SVGS.backIcon;
  export const LineChartIcon = SVGS.lineChartIcon
  export const CandleChartIcon = SVGS.candleChartIcon
  export const DropDownArrow = SVGS.dropDownIcon
  export const XIcon = SVGS.xIcon
