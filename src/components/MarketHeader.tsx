import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Keyboard, StyleSheet } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { useMarketStore } from "../stores/marketStore";
import { moderateScale } from "react-native-size-matters";
import SearchIcon from '../assets/icons/search.svg'
import { colors, fonts } from "../themes/theme";

const MarketHeader = () => {
    const { setSearchQuery } = useMarketStore();
    const [searchText, setSearchText] = useState("");
    const searchFocused = useSharedValue(false);
    const containerAnimatedStyle = useAnimatedStyle(() => ({
        flex: searchFocused.value 
            ? withTiming(1, { duration: 300 })
            : withTiming(0.5, { duration: 300 }),
        marginLeft: searchFocused.value 
            ? withTiming(0, { duration: 300 })
            : withTiming(moderateScale(12), { duration: 300 }),
        marginRight: searchFocused.value 
            ? withTiming(0, { duration: 300 })
            : withTiming(moderateScale(24), { duration: 300 }),
    }));

    const allCoinsAnimatedStyle = useAnimatedStyle(() => ({
        opacity: searchFocused.value 
            ? withTiming(0, { duration: 200 })
            : withTiming(1, { duration: 200 }),
        flex: searchFocused.value 
            ? withTiming(0, { duration: 300 })
            : withTiming(0.5, { duration: 300 }),
    }));

    const handleFocus = () => searchFocused.value = true;
    const handleBlur = () => {
        if (searchText.trim() === "") searchFocused.value = false;
    };

    useEffect(() => {
        const hideListener = Keyboard.addListener("keyboardDidHide", () => {
            if (searchText.trim() === "") searchFocused.value = false;
        });
        return () => hideListener.remove();
    }, [searchText]);

    return (
        <View style={styles.coinListingHeader}>
            <Animated.View style={[styles.allCoinsWrapper, allCoinsAnimatedStyle]}>
                <Text style={styles.allCoins}>All Coins</Text>
                <View style={styles.allCoinsUnderline} />
            </Animated.View>
            
            <Animated.View style={[styles.searchContainer, containerAnimatedStyle]}>
                <TextInput
                    placeholder="Search..."
                    style={styles.searchInput}
                    onChangeText={(text) => {
                        setSearchText(text);
                        setSearchQuery(text);
                    }}
                    value={searchText}
                    placeholderTextColor={"gray"}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
                <SearchIcon width={moderateScale(20)} height={moderateScale(20)} />
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    coinListingHeader: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
    },
    allCoinsWrapper: {
        overflow: 'hidden',
        flex: 0.5,
        paddingLeft: moderateScale(24),
    },
    allCoins: {
        color: colors.text,
        fontFamily: fonts.regular,
        fontSize: moderateScale(20),
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
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.card,
        paddingHorizontal: moderateScale(12),
        height: moderateScale(40),
        borderRadius: moderateScale(20),
        overflow: 'hidden',
    },
    searchInput: {
        flex: 1,
        fontFamily: fonts.regular,
        color: colors.text,
        padding: 0,
        marginRight: moderateScale(8),
        fontSize: moderateScale(20),
    },
});

export default MarketHeader;