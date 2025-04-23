import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";
import { colors, fonts } from "../themes/theme";
import { verticalScale } from "react-native-size-matters";

interface AppButtonProps {
  text: string;
  onPress?: () => void;
  style?: ViewStyle; // Optional for external styling
}

const AppButton: React.FC<AppButtonProps> = ({ text, onPress, style }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    backgroundColor: colors.secondary,
    paddingVertical: verticalScale(12),
    borderRadius: 24,
    alignItems: "center",
  },
  text: {
    color: colors.background,
    fontSize: 16,
    fontFamily: fonts.semibold
  },
});

export default AppButton;
