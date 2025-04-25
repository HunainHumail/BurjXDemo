import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { useTheme } from '../themes/useTheme';
import { RFValue } from 'react-native-responsive-fontsize';

type Props = {
  changePercent: number;
};

const PercentageChangeBadge: React.FC<Props> = ({ changePercent }) => {
  const { colors, fonts } = useTheme();
  const isPositive = changePercent >= 0;
  const formatted = `${Math.abs(changePercent).toFixed(2)}%`;
  
  return (
    <Text
      style={[
        styles.badge,
        {
          fontFamily: fonts.regular,
          color: isPositive ? colors.green : colors.graph_red,
          backgroundColor: colors.lightGrey,
          textAlign: 'center',
        },
      ]}
    >
      {isPositive ? `+${formatted}` : `-${formatted}`}
    </Text>
  );
};


const styles = StyleSheet.create({
  badge: {
    fontSize: RFValue(10),
    padding: moderateScale(2),
    borderRadius: 6.5,
    width: moderateScale(50),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PercentageChangeBadge;
