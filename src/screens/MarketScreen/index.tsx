import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { View, Text, TextInput, FlatList, ActivityIndicator } from "react-native";
import { useCallback, useEffect, useRef } from "react";
import { useMarketStore } from "../../stores/marketStore";
import { colors, fonts } from "../../themes/theme";
import AppButton from "../../components/AppButton";
import CategoryTab from "../../components/CategoryTab";
import CoinListItem from "../../components/CoinListItem";
import styles from "./styles";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { RFValue } from "react-native-responsive-fontsize";
import { SeachIcon } from "../../constants/images";

const TopTabs = createMaterialTopTabNavigator();

const MarketScreen = () => {
  const {
    fetchAllCoins,
    setSearchQuery,
    loading,
    error,
    hasMore,
    filteredCoins,
    searchQuery
  } = useMarketStore();
  const firstLoad = useRef(true);
  const loadingRef = useRef(loading);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    if (firstLoad.current) {
      fetchAllCoins().then(() => firstLoad.current = false);
    }
  }, []);

  const handleEndReached = useCallback(() => {
    if (!loadingRef.current && hasMore) {
      fetchAllCoins(true, true);
    }
  }, [hasMore]);

  if (loading && firstLoad.current) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.green} />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={{ color: 'red' }}>{error}</Text>
        <AppButton text="Retry" onPress={fetchAllCoins} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ height: '38%' }}>
        <TopTabs.Navigator
          screenOptions={{
            tabBarScrollEnabled: true,
            swipeEnabled: false,
            tabBarStyle: { backgroundColor: colors.background },
            tabBarIndicatorStyle: { backgroundColor: colors.green },
            tabBarActiveTintColor: colors.text,
            tabBarInactiveTintColor: colors.textSecondary,
            sceneContainerStyle: { backgroundColor: colors.background },
            tabBarLabelStyle: { fontFamily: fonts.regular, fontSize: RFValue(14) }
          }}
        >
          <TopTabs.Screen
            name="⭐ Featured"
            component={CategoryTab}
            initialParams={{ category: 'featured' }}
          />
          <TopTabs.Screen
            name="🚀 Top Gainers"
            component={CategoryTab}
            initialParams={{ category: 'topGainers' }}
          />
          <TopTabs.Screen
            name="🚩 Top Losers"
            component={CategoryTab}
            initialParams={{ category: 'topLosers' }}
          />
        </TopTabs.Navigator>
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.coinListingHeader}>
          <View style={styles.allCoinsWrapper}>
            <Text style={styles.allCoins}>All Coins</Text>
            <View style={styles.allCoinsUnderline} />
          </View>
          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Search..."
              style={styles.searchInput}
              onChangeText={setSearchQuery}
              placeholderTextColor={colors.textSecondary}
            />
            <SeachIcon
              width={moderateScale(20)}
              height={moderateScale(20)}
            />
          </View>
        </View>
        <FlatList
          data={filteredCoins}
          renderItem={({ item }) => (
            <CoinListItem
              coin={item}
            />
          )}
          keyExtractor={(item) => item.id}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={150}
          showsVerticalScrollIndicator={false}
          style={styles.allCoinsListView}
          ListFooterComponent={() =>
            hasMore ? (
              <ActivityIndicator style={{ padding: 10 }} color={colors.green} />
            ) : (
              <Text style={{ textAlign: 'center', padding: 10 }}>
                No more coins to show
              </Text>
            )
          }
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.3}
          extraData={searchQuery}
          keyboardShouldPersistTaps="handled"
          removeClippedSubviews={true}
        />
      </View>
    </View>
  );
};

export default MarketScreen;