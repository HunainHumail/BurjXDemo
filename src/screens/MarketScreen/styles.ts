import { StyleSheet } from "react-native";
import { colors, fonts } from "../../themes/theme";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { RFValue } from "react-native-responsive-fontsize";

const styles = StyleSheet.create({
    coinItem: {
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    coinImage: {
        width: 30,
        height: 30,
        marginBottom: verticalScale(5),
    },
    chart: {
        marginTop: verticalScale(5),
    },
    allCoins: {
        color: colors.text,
        fontFamily: fonts.regular,
        fontSize: RFValue(18),
        paddingBottom: moderateScale(4), 
        textAlign: 'center'
    },

    allCoinsUnderline: {
        width: '90%',
        height: 2,                
        backgroundColor: colors.green,
        borderRadius: 1,
        alignSelf: 'center'
    },

    searchInput: {
        flex: 1,
        fontFamily: fonts.regular,
        color: colors.text,
        padding: 0,
        marginRight: moderateScale(8),
        fontSize:RFValue(18),
    },
    coinListingHeader: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: moderateScale(24),
        gap: moderateScale(12), 
    },

    allCoinsWrapper: {
        flex: 1, 
    },

    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.card,
        paddingHorizontal: moderateScale(12),
        height: moderateScale(40),
        borderRadius: moderateScale(20),
    },
    allCoinsListView: {
        marginTop: verticalScale(17)
    },
    footer:{ padding: 10 },
    iconContainer: {
        position: 'absolute',
        right: moderateScale(15),
      },
      clearContainer: {
        position: 'absolute',
        right: moderateScale(15),
      },
      listContainer: {
        flex: 1,
        zIndex: 1,
      },
      endText: {
        textAlign: 'center',
        color: colors.textSecondary,
        padding: moderateScale(10),
        fontFamily: fonts.regular,
      },
      centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
      },
});
export default styles