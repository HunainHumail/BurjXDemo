import { Platform } from "react-native";

export const colors = {
  primary: "#black",
  secondary: "#CDFF00",
  icon_red: 'hsla(340, 82%, 52%, 1)',
  green: 'rgba(205, 255, 0, 1)',
  graph_red: 'rgba(255, 52, 64, 1)',
  background: 'black',
  card: "rgba(43, 43, 43, 0.3)",
  text: "white",
  textSecondary: "rgba(255, 255, 255, 0.5)",
  lightGrey: "rgba(255, 255, 255, 0.05)",
  ripple: 'rgba(33, 33, 33, 0.4)'
};

export const fonts = {
  regular: Platform.OS === 'ios' ? 'Lufga' : 'LufgaRegular',
  semibold: Platform.OS === 'ios' ? 'Lufga-SemiBold' : 'LufgaSemiBold',
  light:  Platform.OS === 'ios' ? 'Lufga-Light' : 'LufgaLight'
};