import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    ActivityIndicator,
    TouchableOpacity,
    Text,
    ScrollView,
    ImageBackground,
    Image,
} from 'react-native';
import {
    VictoryChart,
    VictoryCandlestick,
    VictoryAxis,
    VictoryLine,
} from 'victory-native';
import { useTheme } from '../../themes/useTheme';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { BackIcon, Banner } from '../../constants/images';
import NavigationService from '../../utils/NavigationService';
import PercentageChangeBadge from '../../components/PercentageChangeBadge';
import { formatCurrency, formatCurrentPrice, formatLargeNumber, formatVolume } from '../../utils/helpers';
import LineChartIcon from '../../assets/icons/chart-line.svg';
import CandleChartIcon from '../../assets/icons/chart-candlestick.svg';
import { useMarketStore } from '../../stores/marketStore';
import CoinSelector from '../../components/CoinSelector';
import styles from './styles';
import { Dimensions } from 'react-native';
import DropDownArrow from '../../assets/icons/chevron-down.svg'
import { RouteProp } from '@react-navigation/native';


const { width: screenWidth } = Dimensions.get('window');
const timeframes = ['1D', '7D', '30D', '90D', '1Y', 'ALL'];
const CANDLE_SPACING = moderateScale(2);
const CANDLE_VISUAL_WIDTH = moderateScale(10);
const Y_AXIS_WIDTH = moderateScale(50);

type CoinDetailsRouteParams = {
    productId: number;
    image: string;
    name: string;
    symbol: string;
    currentPrice: number;
    priceChangePercentage24h: number;
    marketCap: number;
    tradingVolume: number;
};

type CoinDetailsProps = {
    route: RouteProp<{ CoinDetails: CoinDetailsRouteParams }, 'CoinDetails'>;
};

const CoinDetails: React.FC<CoinDetailsProps> = ({ route }) => {
    const { colors, fonts } = useTheme();
    const store = useMarketStore();
    const [isCandlestick, setIsCandlestick] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);
    // Use route params for coin data
    const {
        productId,
        image,
        name,
        symbol,
        currentPrice,
        priceChangePercentage24h,
        marketCap,
        tradingVolume,
    } = route.params || {};

    // Set initial coin from route params
    useEffect(() => {
        if (productId && !store.selectedCoinId) {
            store.setSelectedCoin(productId);
        }
    }, [productId]);

    // Auto-scroll chart to end when data loads
    useEffect(() => {
        if (!store.loading && store.ohlcData.length > 0) {
            scrollViewRef.current?.scrollToEnd();
        }
    }, [store.loading, store.ohlcData]);



    // Initial loading state (no data yet)
    if (store.loading && store.ohlcData.length === 0) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.green} />
            </View>
        );
    }


    if (!productId || !image || !name || !symbol) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }]}>
                <Text style={{ color: colors.textSecondary, fontFamily: fonts.regular }}>
                    No coin selected
                </Text>
            </View>
        );
    }


    // Error state
    if (store.error) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }]}>
                <Text style={{ color: colors.textSecondary, fontFamily: fonts.regular }}>
                    {store.error}
                </Text>
            </View>
        );
    }

    // No data state
    if (store.ohlcData.length === 0) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }]}>
                <Text style={{ color: colors.textSecondary, fontFamily: fonts.regular }}>
                    No data available
                </Text>
            </View>
        );
    }

    const chartWidth = Math.max(
        screenWidth - Y_AXIS_WIDTH,
        store.ohlcData.length * (CANDLE_VISUAL_WIDTH + CANDLE_SPACING)
    );

    const lastPrice = store.ohlcData[store.ohlcData.length - 1]?.close;
    const yAxisPlotHeight = 350 - 20 - 30;
    const badgeYPosition = lastPrice
        ? (1 - (lastPrice - store.yDomain[0]) / (store.yDomain[1] - store.yDomain[0])) * yAxisPlotHeight
        : 0;

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ImageBackground source={Banner} style={styles.container} imageStyle={styles.backgroundImage}>
                <View style={{ padding: 10, paddingHorizontal: 20 }}>
                    <View style={styles.headerView}>
                        <TouchableOpacity onPress={() => NavigationService.goBack()} style={styles.backIconView}>
                            <BackIcon />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setModalVisible(true)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={{ uri: image }} style={styles.coinImage} />
                            <Text style={styles.headerText}>{name} ({symbol.toUpperCase()})</Text>
                            <DropDownArrow fill={colors.text} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.dataContainer}>
                        <View style={styles.priceContainer}>
                            <Text style={styles.currentPrice}>{formatCurrentPrice(currentPrice)}</Text>
                            <PercentageChangeBadge changePercent={priceChangePercentage24h} />
                        </View>
                        <View style={styles.statsContainer}>
                            <View style={styles.statItem}>
                                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Market Cap</Text>
                                <Text style={[styles.statValue, { color: colors.text }]}>{formatLargeNumber(marketCap)}</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>24h Volume</Text>
                                <Text style={[styles.statValue, { color: colors.text }]}>{formatVolume(tradingVolume)}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.chartContainer}>
                        {store.loading && (
                            <View style={[styles.chartLoader, { backgroundColor: colors.background + 'CC' }]}>
                                <ActivityIndicator size="large" color={colors.green} />
                            </View>
                        )}
                        <View style={styles.chartWrapper}>
                            <ScrollView
                                ref={scrollViewRef}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ width: chartWidth }}
                                decelerationRate={0.95}
                            >
                                <VictoryChart
                                    width={chartWidth}
                                    height={350}
                                    domain={{ y: store.yDomain }}
                                    scale={{ x: 'time' }}
                                    padding={{ top: 20, bottom: 30, left: 50, right: 50 }}
                                    domainPadding={20}
                                >
                                    <VictoryAxis
                                        style={{
                                            axis: { stroke: 'transparent' },
                                            tickLabels: {
                                                fill: colors.textSecondary,
                                                fontSize: moderateScale(10),
                                                fontFamily: fonts.regular,
                                            },
                                            grid: {
                                                stroke: colors.textSecondary + '66',
                                                strokeWidth: 0.8,
                                                strokeDasharray: "4,2",
                                            }
                                        }}
                                        tickFormat={(t) => new Date(t).toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: 'short'
                                        })}
                                    />
                                    {isCandlestick ? (
                                        <VictoryCandlestick
                                            data={store.ohlcData}
                                            candleRatio={0.6}
                                            wickStrokeWidth={1}
                                            style={{
                                                data: {
                                                    rx: 3,
                                                    ry: 3,
                                                    fill: ({ datum }) =>
                                                        datum.close > datum.open
                                                            ? colors.green + 'DD'
                                                            : colors.graph_red + 'DD',
                                                    stroke: ({ datum }) =>
                                                        datum.close > datum.open
                                                            ? colors.green
                                                            : colors.graph_red,
                                                    strokeWidth: 1,
                                                }
                                            }}
                                        />
                                    ) : (
                                        <VictoryLine
                                            data={store.ohlcData}
                                            x="x"
                                            y="close"
                                            style={{
                                                data: {
                                                    stroke: colors.green,
                                                    strokeWidth: 1.5
                                                }
                                            }}
                                        />
                                    )}
                                    {lastPrice && (
                                        <VictoryLine
                                            data={[
                                                { x: store.ohlcData[0].x, y: lastPrice },
                                                { x: store.ohlcData[store.ohlcData.length - 1].x, y: lastPrice }
                                            ]}
                                            style={{
                                                data: {
                                                    stroke: colors.green,
                                                    strokeOpacity: 0.2,
                                                    strokeWidth: 0.5
                                                }
                                            }}
                                        />
                                    )}
                                </VictoryChart>
                            </ScrollView>
                        </View>
                        <View style={styles.yAxisContainer}>
                            <VictoryChart
                                width={Y_AXIS_WIDTH}
                                height={350}
                                domain={{ y: store.yDomain }}
                                padding={{ top: 20, bottom: 30, left: 10, right: 30 }}
                            >
                                <VictoryAxis
                                    dependentAxis
                                    orientation="right"
                                    style={{
                                        axis: { stroke: 'transparent' },
                                        tickLabels: {
                                            fill: colors.textSecondary,
                                            fontSize: moderateScale(12),
                                            fontFamily: fonts.regular,
                                            textAnchor: 'end',
                                            padding: 15,
                                        },
                                        grid: {
                                            stroke: colors.textSecondary + '44',
                                            strokeWidth: 0.5,
                                            strokeDasharray: "2,2",
                                        },
                                    }}
                                    tickFormat={formatCurrency}
                                />
                            </VictoryChart>
                            {lastPrice && (
                                <View style={[
                                    styles.yAxisBadge,
                                    {
                                        top: badgeYPosition + 20 - 10,
                                        backgroundColor: colors.green,
                                        right: moderateScale(-10),
                                    }
                                ]}>
                                    <Text style={[styles.badgeText, { color: colors.background }]}>
                                        {formatCurrency(lastPrice)}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
                <View style={styles.timeframeRow}>
                    {timeframes.map((tf) => (
                        <TouchableOpacity
                            key={tf}
                            onPress={() => store.setSelectedTimeframe(tf)}
                            style={[
                                styles.tfButton,
                                store.selectedTimeframe === tf && { backgroundColor: colors.green }
                            ]}
                        >
                            <Text
                                style={[
                                    styles.tfText,
                                    { color: store.selectedTimeframe === tf ? colors.background : colors.textSecondary }
                                ]}
                            >
                                {tf}
                            </Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity onPress={() => setIsCandlestick(!isCandlestick)} style={styles.toggleButton}>
                        {isCandlestick ? (
                            <LineChartIcon width={moderateScale(24)} height={moderateScale(24)} stroke={colors.green} />
                        ) : (
                            <CandleChartIcon width={moderateScale(24)} height={moderateScale(24)} stroke={colors.green} />
                        )}
                    </TouchableOpacity>
                </View>
            </ImageBackground>
            <CoinSelector
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSelect={(coin) => {
                    store.setSelectedCoin(coin.productId);
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
            />
        </View>
    );
};

export default CoinDetails;