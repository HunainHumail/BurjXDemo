import React, { useCallback } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Modal, StyleSheet, ActivityIndicator, Platform, StatusBar } from 'react-native';
import { useMarketStore } from '../stores/marketStore';
import { useTheme } from '../themes/useTheme';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import FastImage from '@d11/react-native-fast-image';
import { colors, fonts } from '../themes/theme';
import { LegendList } from '@legendapp/list';
import { Coin } from './CoinView';

type Props = {
    visible: boolean;
    onClose: () => void;
    onSelect: (coin: any) => void;
};

export default function CoinSelector({ visible, onClose, onSelect }: Props) {
    const { colors, fonts } = useTheme();
    const {
        filteredCoins,
        loading,
        hasMore,
        loadMore,
        setSearchQuery
    } = useMarketStore();

    const renderItem = useCallback(
        ({ item }) => <CoinRow item={item} onSelect={(c) => { onSelect(c); onClose(); }} />,
        [onSelect, onClose]
    );

    const keyExtractor = useCallback((coin: Coin) => coin.productId.toString(), []);

    return (
        <Modal
            presentationStyle={Platform.OS === 'ios' ? 'formSheet' : 'fullScreen'}
            statusBarTranslucent={true}
            // style={{ height: '80%', marginTop: 20 }}
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={[styles.header, { backgroundColor: colors.background, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
                <TextInput
                    placeholder="Search coins..."
                    placeholderTextColor={colors.textSecondary}
                    onChangeText={setSearchQuery}
                    style={[styles.searchInput, { color: colors.text, borderColor: colors.lightGrey }]}
                />
                <TouchableOpacity onPress={onClose}>
                    <Text style={{ color: colors.green, fontFamily: fonts.semibold }}>Close</Text>
                </TouchableOpacity>
            </View>
            <LegendList
                data={filteredCoins}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                recycleItems
                estimatedItemSize={100}
                drawDistance={2000}
                waitForInitialLayout
                onEndReached={() => hasMore && loadMore()}
                onEndReachedThreshold={0.5}
                ListFooterComponent={hasMore ? <ActivityIndicator style={{ margin: 16 }} color={colors.green} /> : null}
                style={{ backgroundColor: colors.background }}
                contentContainerStyle={{ backgroundColor: colors.background }}
            />
        </Modal >
    );
}

const CoinRow = React.memo(({ item, onSelect }) => (
    <TouchableOpacity onPress={() => onSelect(item)} style={styles.row}>
        <FastImage source={{ uri: item.image }} style={styles.icon} />
        <Text style={styles.text}>{item.symbol.toUpperCase()} — {item.name}</Text>
    </TouchableOpacity>
));


const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        padding: moderateScale(12),
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    searchInput: {
        flex: 1,
        borderWidth: 1,
        borderRadius: moderateScale(8),
        paddingHorizontal: moderateScale(10),
        marginRight: moderateScale(8),
        height: verticalScale(36),
    },
    row: {
        padding: moderateScale(12),
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    icon: { width: moderateScale(20), height: moderateScale(20), marginRight: moderateScale(12) },
    text: { color: colors.text, fontFamily: fonts.regular, marginLeft: moderateScale(20) }
});
