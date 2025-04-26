import React, { useCallback } from 'react';
import { View, Text, Modal, StyleSheet, ActivityIndicator, Platform, StatusBar, TouchableOpacity } from 'react-native';
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
        allCoins,
        loading,
        hasMore,
        loadMore
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
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={[styles.header, { 
                backgroundColor: colors.background, 
                paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
                justifyContent: 'flex-end'
            }]}>
                <TouchableOpacity onPress={onClose}>
                    <Text style={{ 
                        color: colors.green, 
                        fontFamily: fonts.semibold,
                        fontSize: moderateScale(16),
                        padding: moderateScale(12)
                    }}>
                        Close
                    </Text>
                </TouchableOpacity>
            </View>
            
            <LegendList
                data={allCoins}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                recycleItems
                estimatedItemSize={100}
                drawDistance={2000}
                waitForInitialLayout
                onEndReached={() => hasMore && loadMore()}
                onEndReachedThreshold={0.5}
                ListFooterComponent={hasMore ? 
                    <ActivityIndicator style={{ margin: 16 }} color={colors.green} /> : 
                    <Text style={{ 
                        textAlign: 'center', 
                        padding: 16, 
                        color: colors.textSecondary,
                        fontFamily: fonts.regular
                    }}>
                        All coins loaded
                    </Text>}
                style={{ backgroundColor: colors.background }}
                contentContainerStyle={{ backgroundColor: colors.background }}
            />
        </Modal>
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
        alignItems: 'center'
    },
    row: {
        padding: moderateScale(12),
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: colors.lightGrey
    },
    icon: { 
        width: moderateScale(20), 
        height: moderateScale(20), 
        marginRight: moderateScale(12) 
    },
    text: { 
        color: colors.text, 
        fontFamily: fonts.regular, 
        fontSize: moderateScale(14)
    }
});