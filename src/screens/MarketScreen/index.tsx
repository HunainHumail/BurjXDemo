import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useNavigation } from "@react-navigation/native";
import { Pressable, View, Image, Text, TextInput, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { useTheme } from "../../themes/useTheme";
import { useCallback, useEffect, useRef } from "react";
import { useMarketStore } from "../../stores/marketStore";
import { VictoryAxis, VictoryChart, VictoryLine } from "victory-native";
import { colors, fonts } from "../../themes/theme";
import { useRoute } from "@react-navigation/native";
import AppButton from "../../components/AppButton";
import { LegendList } from "@legendapp/list";
import CategoryTab from "../../components/CategoryTab";
import CoinItem from "../../components/CoinBox";
import { moderateScale, verticalScale } from "react-native-size-matters";
import CoinListItem from "../../components/CoinListItem";
import styles from "./styles";
import SearchIcon from '../../assets/icons/search.svg';


const TopTabs = createMaterialTopTabNavigator();


const MarketScreen = () => {
  const {
    fetchAllCoins,
    setSearchQuery,
    loadMore,
    loading,
    error,
    hasMore,
    filteredCoins,
    searchQuery
  } = useMarketStore();
  // track whether first load has happened
  const firstLoad = useRef(true);
  const loadingRef = useRef(loading);


  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);


  useEffect(() => {
    console.log('Current state:', {
      loading: useMarketStore.getState().loading,
      allCoins: useMarketStore.getState().allCoins.length,
      error: useMarketStore.getState().error
    });
  }, [loading]);

  // Initial load
  useEffect(() => {
    if (firstLoad.current) {
      fetchAllCoins().then(() => firstLoad.current = false);
    }
  }, []);

  // Optimized scroll handler
  const handleEndReached = useCallback(() => {
    if (!loadingRef.current && hasMore) {
      fetchAllCoins(true, true);
    }
  }, [hasMore]);

  // Add loading indicator
  // show loader only on first load
  if (loading && firstLoad.current) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.green} />
      </View>
    );
  }
  // Add error handling
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
      <View style={{ height: verticalScale(220), backgroundColor: colors.background }}>

        <TopTabs.Navigator
          // 1. Tab bar background
          screenOptions={{
            tabBarScrollEnabled: true,
            swipeEnabled: false,
            tabBarStyle: { backgroundColor: colors.background },
            // 2. The little indicator under the active tab
            tabBarIndicatorStyle: { backgroundColor: colors.green },
            // 3. Text color of active/inactive tabs
            tabBarActiveTintColor: colors.text,
            tabBarInactiveTintColor: colors.textSecondary,
            // 4. Make the scene (i.e. each tab's content) also use your bg
            sceneContainerStyle: { backgroundColor: colors.background },
            sceneStyle: { marginTop: 10 },
            tabBarLabelStyle: { fontFamily: fonts.regular, fontSize: 20 }
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
            {/* right‐aligned icon */}
            <SearchIcon
              width={moderateScale(20)}
              height={moderateScale(20)}
            />
          </View>
        </View>
        <LegendList
          style={styles.allCoinsListView}
          data={filteredCoins}  // Changed from displayedCoins
          renderItem={({ item }) => <CoinListItem coin={item} />}
          keyExtractor={(item) => item.id}
          estimatedItemSize={100}
          showsVerticalScrollIndicator={false}
          key={`list-${searchQuery}`}
          maintainVisibleContentPosition={{
            minIndexForVisible: 1,
            autoscrollToTopThreshold: 30,
          }}
          ListFooterComponent={() =>
            hasMore
              ? <ActivityIndicator style={{ padding: 10 }} color={colors.green} />
              : <Text style={{ textAlign: 'center', padding: 10 }}>
                No more coins to show
              </Text>
          }
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.3}
        />
      </View>
    </View>
  );
};



export default MarketScreen;