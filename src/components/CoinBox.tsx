import React from 'react';
import { Pressable, View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { useTheme } from '../themes/useTheme';
import NavigationService from '../utils/NavigationService';

import CoinView, { Coin } from './CoinView';
import SparklineChart from './SparklineChart';
import PercentageChangeBadge from './PercentageChangeBadge';
import CardWrapper from './CardWrapper';
import { RFValue } from 'react-native-responsive-fontsize';
import { formatCurrency, formatCurrentPrice } from '../utils/helpers';
import { useMarketStore } from '../stores/marketStore';

type Props = {
  coin: Coin;
};

const CoinBox: React.FC<Props> = ({ coin }) => {
  const { colors, fonts } = useTheme();
  const cardWidth = moderateScale(160);
  return (
    <View style={[styles.wrapper, { width: cardWidth }]}>
      <TouchableOpacity
        onPress={() => {
          useMarketStore.getState().setSelectedCoin(coin.productId);
          NavigationService.navigate('CoinDetails', {
            productId: coin.productId,
            image: coin.image,
            name: coin.name,
            symbol: coin.symbol,
            currentPrice: coin.currentPrice,
            priceChangePercentage24h: coin.priceChangePercentage24h,
            marketCap: coin.marketCap,
            tradingVolume: coin.tradingVolume,
          });
        }}

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
                { fontFamily: fonts.regular, color: colors.text },
              ]}
            >
              {formatCurrency(coin.currentPrice)}
            </Text>
            <PercentageChangeBadge changePercent={coin.priceChangePercentage24h} />
          </View>
        </CardWrapper>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    margin: 8,
    justifyContent: 'center'
  },
  text: {
    fontSize: RFValue(12),
  },
  chartContainer: {
    width: '100%',
    height: moderateScale(80), // Fixed height for consistency
    justifyContent: 'center',
    alignItems: 'center'
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginTop: 'auto', // Push footer to bottom
  },
});

export default CoinBox;