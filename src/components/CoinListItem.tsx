import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { useTheme } from '../themes/useTheme';
import NavigationService from '../utils/NavigationService';
import Card from '../assets/images/card.svg';

import CoinView, { Coin } from './CoinView';
import SparklineChart from './SparklineChart';
import PercentageChangeBadge from './PercentageChangeBadge';
import { colors } from '../themes/theme';

type Props = {
  coin: Coin;
};


const CoinListItem: React.FC<Props> = ({ coin }) => {
  const { colors, fonts } = useTheme();
  return (
    <Pressable
      onPress={() =>
        NavigationService.navigate('CoinDetails', { coinId: coin.id, productId: coin.productId, coinImage: coin.image, coinName: coin.name, coinSymbol: coin.symbol, currentPrice: coin.currentPrice, priceChangePercentage24h: coin.priceChangePercentage24h })
      }
      style={styles.wrapper}
    >

      <View style={styles.leftView}>
        <CoinView
          image={coin.image}
          symbol={coin.symbol}
          name={coin.name}
        />


        <Text
          style={[
            styles.text,
            { fontFamily: fonts.regular, color: colors.text },
          ]}
        >
          ${coin.currentPrice.toLocaleString()}
        </Text>
      </View>
      <View style={styles.rightView}>
        <PercentageChangeBadge changePercent={coin.priceChangePercentage24h} />
        <View style={styles.chartContainer}>
          <SparklineChart
            data={coin.sparkline}
            changePercent={coin.priceChangePercentage24h}
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
    height: verticalScale(100),
    backgroundColor: colors.card,
    padding: moderateScale(15),
    justifyContent: 'space-between',
    borderRadius: moderateScale(12),
    alignSelf: 'center',
    marginVertical: 2
  },
  text: {
    fontSize: moderateScale(15),
  },
  chartContainer: {
    width: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  leftView: {
    justifyContent: 'space-between'
  },
  rightView: {
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  }
});

export default CoinListItem;
