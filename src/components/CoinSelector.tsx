import React from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Modal, StyleSheet, ActivityIndicator } from 'react-native';
import { useMarketStore } from '../stores/marketStore';
import { useTheme } from '../themes/useTheme';
import { moderateScale, verticalScale } from 'react-native-size-matters';

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

    return (
        <Modal
            presentationStyle="formSheet"
            statusBarTranslucent={true}
            style={{height: '80%', marginTop: 20}}
            visible={visible} animationType="slide" >
            <View style={[styles.header, { backgroundColor: colors.background }]}>
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
            <FlatList
                data={filteredCoins}
                keyExtractor={c => c.productId.toString()}
                style={{backgroundColor: colors.background}}
                contentContainerStyle={{ backgroundColor: colors.background }}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[styles.row, { borderBottomColor: colors.lightGrey }]}
                        onPress={() => { onSelect(item); onClose(); }}
                    >
                        <Text style={{ color: colors.text, fontFamily: fonts.regular }}>
                            {item.symbol.toUpperCase()} — {item.name}
                        </Text>
                    </TouchableOpacity>
                )}
                onEndReached={() => hasMore && loadMore()}
                onEndReachedThreshold={0.5}
                ListFooterComponent={hasMore ? <ActivityIndicator style={{ margin: 16 }} color={colors.green} /> : null}
            />
        </Modal >
    );
}

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
    }
});
