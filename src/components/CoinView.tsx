import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { useTheme } from '../themes/useTheme';
import { RFValue } from 'react-native-responsive-fontsize';
import FastImage from '@d11/react-native-fast-image';

export type Coin = {
    productId: number;
    id: string;
    name: string;
    image: string;
    currentPrice: number;
    priceChangePercentage24h: number;
    sparkline: number[];
    marketCap: number;
    tradingVolume: number;
    symbol: string;
};

type Props = {
    image: string;
    symbol: string;
    name: string;
};

const CoinView: React.FC<Props> = ({ image, symbol, name }) => {
    const { colors, fonts } = useTheme();

    return (
        <View style={styles.container}>
            <FastImage source={{ uri: image }} style={styles.image} />
            <View style={styles.nameContainer}>
                <Text style={[styles.text, { fontFamily: fonts.regular, color: colors.text }]}>
                    {symbol.toUpperCase()}
                </Text>
                <Text style={[styles.subtext, { fontFamily: fonts.light, color: colors.text }]}>
                    {name}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    image: {
        width: moderateScale(30),
        height: moderateScale(30),
    },
    nameContainer: {
        marginLeft: moderateScale(20),
    },
    text: {
        fontSize: RFValue(14),
    },
    subtext: {
        fontSize: RFValue(9),
    }
});

export default CoinView;
