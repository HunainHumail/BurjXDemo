import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { useTheme } from '../themes/useTheme';
import NavigationService from '../utils/NavigationService';

import CoinView, { Coin } from './CoinView';
import SparklineChart from './SparklineChart';
import PercentageChangeBadge from './PercentageChangeBadge';
import CardWrapper from './CardWrapper';

type Props = {
  coin: Coin;
};

const CoinBox: React.FC<Props> = ({ coin }) => {
  const { colors, fonts } = useTheme();
  const cardWidth = moderateScale(180);
  console.log('colors.card:', colors.card);
  return (
    <Pressable
      onPress={() =>
        NavigationService.navigate('CoinDetails', { coinId: coin.id })
      }
      style={[styles.wrapper, { width: cardWidth }]}
    >
      <CardWrapper width={cardWidth} backgroundColor={colors.card}>
        <CoinView image={coin.image} symbol={coin.symbol} name={coin.name} />
        <View style={styles.chartContainer}>
          <SparklineChart
            data={coin.sparkline}
            changePercent={coin.priceChangePercentage24h}
          />
        </View>
        <View style={styles.footer}>
          <Text
            style={[
              styles.text,
              { fontFamily: fonts.regular, color: colors.text, fontSize: moderateScale(16) },
            ]}
          >
            ${coin.currentPrice.toLocaleString()}
          </Text>
          <PercentageChangeBadge changePercent={coin.priceChangePercentage24h} />
        </View>
      </CardWrapper>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    margin: 8,
  },
  text: {
    fontSize: 14,
  },
  chartContainer: {
    width: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
});

export default CoinBox;