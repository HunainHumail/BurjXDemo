import { StyleSheet } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { colors, fonts } from "../../themes/theme";
import { RFValue } from "react-native-responsive-fontsize";

const Y_AXIS_WIDTH = moderateScale(50);

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
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: moderateScale(8),
        // Remove border styles if not needed
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

export default styles