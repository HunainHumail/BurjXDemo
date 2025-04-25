import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { moderateScale, verticalScale, scale } from 'react-native-size-matters';
import { useTheme } from '../themes/useTheme';
import NavigationService from '../utils/NavigationService';
import CoinView, { Coin } from './CoinView';
import SparklineChart from './SparklineChart';
import PercentageChangeBadge from './PercentageChangeBadge';
import { colors, fonts } from '../themes/theme';
import { RFValue } from 'react-native-responsive-fontsize';
import { formatCurrentPrice } from '../utils/helpers';
import { useMarketStore } from '../stores/marketStore';

const CoinListItem: React.FC<{ coin: Coin }> = ({ coin }) => {
  const { colors, fonts } = useTheme();

  return (
    <Pressable
      // onPress={() =>
      //   NavigationService.navigate('CoinDetails', {
      //     coinId: coin.id,
      //     productId: coin.productId,
      //     coinImage: coin.image,
      //     coinName: coin.name,
      //     coinSymbol: coin.symbol,
      //     currentPrice: coin.currentPrice,
      //     priceChangePercentage24h: coin.priceChangePercentage24h,
      //     marketCap: coin.marketCap,
      //     tradingVolume: coin.tradingVolume
      //   })
      // }
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
      style={styles.wrapper}
    >
      <View style={styles.leftView}>
        <CoinView
          image={coin.image}
          symbol={coin.symbol}
          name={coin.name}
        />

        <Text style={[styles.priceText, { color: colors.text }]}>
          {formatCurrentPrice(coin.currentPrice)}
        </Text>
      </View>

      <View style={styles.rightView}>
        <PercentageChangeBadge
          changePercent={coin.priceChangePercentage24h}
        />
        <View style={styles.chartContainer}>
          <SparklineChart
            data={coin.sparkline}
            changePercent={coin.priceChangePercentage24h}
            width={moderateScale(100)}
            height={verticalScale(40)}
          />
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    width: '90%',
    backgroundColor: colors.card,
    padding: moderateScale(12),
    justifyContent: 'space-between',
    borderRadius: moderateScale(10),
    marginVertical: verticalScale(4),
    alignSelf: 'center',
  },
  leftView: {
    flex: 1,
    justifyContent: 'space-between',
    marginRight: moderateScale(10),
  },
  rightView: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  chartContainer: {
    width: moderateScale(100),
    marginTop: verticalScale(20)
  },
  priceText: {
    fontFamily: fonts.regular,
    fontSize: RFValue(12),
    includeFontPadding: false,
  },
});

export default CoinListItem;