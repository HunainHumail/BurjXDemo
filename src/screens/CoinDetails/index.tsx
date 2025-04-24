import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
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
    ClipPath,
} from 'victory-native';
import { useTheme } from '../../themes/useTheme';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import Svg, { Defs, G, Line, Mask, Path, Rect } from 'react-native-svg';
import { colors, fonts } from '../../themes/theme';
import { Banner } from '../../constants/images';
import BackIcon from '../../assets/icons/icon-back.svg'
import NavigationService from '../../utils/NavigationService';
import PercentageChangeBadge from '../../components/PercentageChangeBadge';
import ExpandIcon from '../../assets/icons/expand-icon.svg'
import { formatCurrency, formatCurrentPrice, formatLargeNumber, formatVolume } from '../../utils/helpers';
import { RFValue } from 'react-native-responsive-fontsize';

const { width: screenWidth } = Dimensions.get('window');
const timeframes = ['1D', '7D', '30D', '90D', '1Y', 'ALL'];
const CANDLE_SPACING = moderateScale(2);
const CANDLE_VISUAL_WIDTH = moderateScale(10);
const Y_AXIS_WIDTH = moderateScale(50);


const CoinDetails = ({ route }) => {
    const { colors, fonts } = useTheme();
    const {
        productId,
        coinImage,
        coinName,
        coinSymbol,
        priceChangePercentage24h,
        currentPrice,
        marketCap,
        tradingVolume
    } = route.params; const [candleData, setCandleData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedTimeframe, setSelectedTimeframe] = useState('30D');
    const [isCandlestick, setIsCandlestick] = useState(true); // Add this state
    const [yDomain, setYDomain] = useState([0, 100]);

    const scrollViewRef = useRef();
    const isFirstLoad = useRef(true);

    useEffect(() => { loadData() }, [selectedTimeframe]);
    useEffect(() => { if (!loading) scrollViewRef.current?.scrollToEnd() }, [loading, candleData]);

    const loadData = async () => {
        const isInitial = isFirstLoad.current;
        if (isInitial) setLoading(true);
        else setRefreshing(true);

        try {
            const daysMap = { '1D': 1, '7D': 7, '30D': 30, '90D': 90, '1Y': 365, 'ALL': 'max' };
            const response = await fetch(
                `https://coingeko.burjx.com/coin-ohlc?productId=${productId}&days=${daysMap[selectedTimeframe]}`
            );
            const json = await response.json();
            const lows = json.map(item => +item.usd.low);
            const highs = json.map(item => +item.usd.high);
            const minVal = Math.min(...lows);
            const maxVal = Math.max(...highs);
            setYDomain([minVal * 0.98, maxVal * 1.02]);
            setCandleData(json.map(item => ({
                x: new Date(item.date),
                open: +item.usd.open,
                high: +item.usd.high,
                low: +item.usd.low,
                close: +item.usd.close,
            })));
        } catch (err) {
            console.error('Load error:', err);
            setCandleData([]);
        } finally {
            if (isInitial) {
                setLoading(false);
                isFirstLoad.current = false;
            } else {
                setRefreshing(false);
            }
        }
    };


    const chartWidth = Math.max(
        screenWidth - Y_AXIS_WIDTH,
        candleData.length * (CANDLE_VISUAL_WIDTH + CANDLE_SPACING)
    );

    const lastPrice = candleData[candleData.length - 1]?.close;
    // const yDomain = candleData.length > 0 ? [
    //     Math.min(...candleData.map(d => d.low)) * 0.95,
    //     Math.max(...candleData.map(d => d.high)) * 1.05
    // ] : [0, 100];
    // Tighter padding



    const yAxisPlotHeight = 350 - 20 - 30; // Total height - top padding - bottom padding
    const badgeYPosition = lastPrice
        ? (1 - (lastPrice - yDomain[0]) / (yDomain[1] - yDomain[0])) * yAxisPlotHeight
        : 0;


    // Early return for full‐screen loader
    // 1️⃣ Initial‐load or timeframe‐change spinner
    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.green} />
            </View>
        );
    }

    // 2️⃣ No‐data fallback
    if (candleData.length === 0) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }]}>
                <Text style={{ color: colors.textSecondary, fontFamily: fonts.regular }}>
                    No data available
                </Text>
            </View>
        );
    }
    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ImageBackground
                source={Banner}
                style={styles.container}
                imageStyle={styles.backgroundImage}
            >
                <View style={{ padding: 10, paddingHorizontal: 20 }}>
                    <View style={styles.headerView}>
                        <TouchableOpacity onPress={() => NavigationService.goBack()} style={styles.backIconView}>
                            <BackIcon />
                        </TouchableOpacity>
                        <Image source={{ uri: coinImage }} style={styles.coinImage} />
                        <Text style={styles.headerText}>{coinName} ({coinSymbol.toUpperCase()})</Text>
                    </View>
                    <>
                        <View style={styles.dataContainer}>
                            {/* Left Side - Price and Percentage */}
                            <View style={styles.priceContainer}>
                                <Text style={styles.currentPrice}>{formatCurrentPrice(currentPrice)}</Text>
                                <PercentageChangeBadge changePercent={priceChangePercentage24h} />
                            </View>

                            {/* Right Side - Stats */}
                            <View style={styles.statsContainer}>
                                <View style={styles.statItem}>
                                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Market Cap</Text>
                                    <Text style={[styles.statValue, { color: colors.text }]}>
                                        {formatLargeNumber(marketCap)}
                                    </Text>
                                </View>

                                <View style={styles.statItem}>
                                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>24h Volume</Text>
                                    <Text style={[styles.statValue, { color: colors.text }]}>
                                        {formatVolume(tradingVolume)}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.chartContainer}>
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
                                        domain={{ y: yDomain }}
                                        scale={{ x: 'time' }}
                                        padding={{ top: 20, bottom: 30, left: 50, right: 50 }} // Balanced padding
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
                                                    stroke: colors.textSecondary + '66',  // Increased opacity
                                                    strokeWidth: 0.8,                    // Thicker lines
                                                    strokeDasharray: "4,2",              // More visible dashes
                                                }
                                            }}
                                            tickFormat={(t) => new Date(t).toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: 'short'
                                            })}
                                        />
                                        {isCandlestick ? (
                                            <VictoryCandlestick
                                                data={candleData}
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
                                                data={candleData}
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
                                                    { x: candleData[0].x, y: lastPrice },
                                                    { x: candleData[candleData.length - 1].x, y: lastPrice }
                                                ]}
                                                style={{
                                                    data: {
                                                        stroke: colors.green,
                                                        strokeOpacity: 0.2,  // Increased visibility
                                                        strokeWidth: 0.5     // Slightly thicker line
                                                    }
                                                }}
                                            />
                                        )}
                                    </VictoryChart>
                                </ScrollView>
                            </View>
                            {refreshing && (
                                <View style={[StyleSheet.absoluteFill, styles.loaderOverlay]}>
                                    <ActivityIndicator size="small" color={colors.primary} />
                                </View>
                            )}
                            <View style={styles.yAxisContainer}>
                                <VictoryChart
                                    width={Y_AXIS_WIDTH}
                                    height={350}
                                    domain={{ y: yDomain }}
                                    padding={{ top: 20, bottom: 30, left: 10, right: 30 }} // Match main chart
                                // padding={{ top: 20, bottom: 30, left: 20, right: 20 }}
                                // domain={{ y: yDomain }}
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
                                                stroke: colors.textSecondary + '44', // Match X-axis opacity
                                                strokeWidth: 0.5,
                                                strokeDasharray: "2,2", // Consistent dotted style
                                            },
                                        }}
                                        tickFormat={formatCurrency}
                                    />
                                </VictoryChart>
                                {lastPrice && (
                                    <View style={[
                                        styles.yAxisBadge,
                                        {
                                            top: badgeYPosition + 20 - 10, // 20 = paddingTop, 10 = half badge height
                                            backgroundColor: colors.green,
                                            right: moderateScale(-10), // Adjust based on Y-axis width
                                        }
                                    ]}>
                                        <Text style={[styles.badgeText, { color: colors.background }]}>
                                            {formatCurrency(lastPrice)}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>

                    </>
                </View>
                <View style={styles.timeframeRow}>
                    {timeframes.map((tf) => (
                        <TouchableOpacity
                            key={tf}
                            onPress={() => setSelectedTimeframe(tf)}
                            style={[
                                styles.tfButton,
                                selectedTimeframe === tf && { backgroundColor: colors.green }
                            ]}
                        >
                            <Text
                                style={[
                                    styles.tfText,
                                    { color: selectedTimeframe === tf ? colors.background : colors.textSecondary }
                                ]}
                            >
                                {tf}
                            </Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                        onPress={() => setIsCandlestick(!isCandlestick)}
                        style={[
                            styles.toggleButton,
                            { backgroundColor: isCandlestick ? colors.green : colors.background }
                        ]}
                    >
                        <View style={[
                            styles.toggleInner,
                            { borderColor: isCandlestick ? colors.background : colors.textSecondary }
                        ]} />
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // padding: moderateScale(16),
    },
    bannerContainer: {
        flex: 1,
        position: 'relative',
        backgroundColor: 'transparent', // Add this
        overflow: 'hidden', // Add this
    },
    bannerContent: {
        position: 'absolute',
        top: moderateScale(16), // Match container padding
        left: moderateScale(16),
        right: moderateScale(16),
        bottom: moderateScale(16),
        zIndex: 1,
    },
    timeframeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: moderateScale(12),
        paddingHorizontal: moderateScale(16)
    },
    tfButton: {
        paddingVertical: moderateScale(6),
        paddingHorizontal: moderateScale(12),
        borderRadius: moderateScale(20),
    },
    tfText: {
        fontSize: moderateScale(12),
        fontFamily: fonts.regular,
    },
    expandButton: {
        marginLeft: moderateScale(8),
        padding: moderateScale(6),
        borderRadius: moderateScale(12),
    },
    centerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chartContainer: {
        flexDirection: 'row',
        height: 350,
        position: 'relative', // Add this
    },
    yAxisContainer: {
        width: Y_AXIS_WIDTH,
        height: 350,
        position: 'absolute',
        right: 0,
        zIndex: 2,
    },
    yAxisBadge: {
        position: 'absolute',
        right: moderateScale(10),
        paddingHorizontal: moderateScale(5),
        borderRadius: moderateScale(4),
        zIndex: 10,
        width: moderateScale(70),
        paddingVertical: verticalScale(4),
        justifyContent: 'center',
        alignItems: 'center',
        // Add shadow for visibility
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    badgeText: {
        fontSize: moderateScale(10),
        fontWeight: 'bold',
    },
    backgroundImage: {
        flex: 1,
        height: '78%',
        resizeMode: 'stretch',
        opacity: 0.9, // Adjust based on your image
    },
    headerView: {
        flexDirection: 'row',
        marginTop: verticalScale(10),
        alignItems: 'center'
    },
    backIconView: {
        backgroundColor: colors.lightGrey,
        padding: moderateScale(13),
        borderRadius: moderateScale(50)
    },
    coinImage: { height: moderateScale(24), width: moderateScale(24), marginLeft: moderateScale(48) },
    headerText: { fontFamily: fonts.semibold, fontSize: moderateScale(16), color: colors.text, marginLeft: moderateScale(12) },
    loaderOverlay: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        zIndex: 5,
    },
    toggleButton: {
        width: moderateScale(24),
        height: moderateScale(24),
        borderRadius: moderateScale(12),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.textSecondary,
    },
    toggleInner: {
        width: moderateScale(12),
        height: moderateScale(12),
        borderRadius: moderateScale(6),
        borderWidth: 1,
    },
    dataContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginTop: verticalScale(16),
    },
    priceContainer: {
        flex: 1,
        marginRight: moderateScale(16),
    },
    currentPrice: {
        fontFamily: fonts.regular,
        fontSize: moderateScale(32),
        color: colors.text,
        marginBottom: verticalScale(8),
    },
    statsContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    statItem: {
        alignItems: 'flex-end',
        marginBottom: verticalScale(8),
    },
    statLabel: {
        fontFamily: fonts.regular,
        fontSize: RFValue(10),

    },
    statValue: {
        fontFamily: fonts.semibold,
        fontSize: moderateScale(14),
    },
    chartWrapper: {
        flexDirection: 'row',
        height: 350,
        overflow: 'hidden',
    },
});

export default CoinDetails;