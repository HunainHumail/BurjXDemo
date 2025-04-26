import { StyleSheet } from "react-native";
import { colors, fonts } from "../../themes/theme";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { RFValue } from 'react-native-responsive-fontsize'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: verticalScale(20),
        paddingHorizontal: moderateScale(24)
    },
    text: {
        color: colors.text,
        fontFamily: fonts.regular,
        fontSize: RFValue(25),
        alignSelf: 'flex-start',
        width: '70%'
    },
    image: {
        height: verticalScale(400)
    },
    errorText: {
        color: colors.icon_red,
        fontFamily: fonts.regular,
        fontSize: RFValue(25),
        alignSelf: 'flex-start',
        width: '60%'
    }
});

export default styles