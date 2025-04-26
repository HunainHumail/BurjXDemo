import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming
} from 'react-native-reanimated';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useMarketStore } from '../../stores/marketStore';
import { colors, fonts } from '../../themes/theme';
import AppButton from '../../components/AppButton';
import CategoryTab from '../../components/CategoryTab';
import CoinListItem from '../../components/CoinListItem';
import styles from './styles';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { RFValue } from 'react-native-responsive-fontsize';
import { SeachIcon, XIcon } from '../../constants/images';

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
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Calculate initial height (38% of screen)
  const screenHeight = Dimensions.get('window').height;
  const initialTabsHeight = screenHeight * 0.38;

  // Use Reanimated for smooth 60fps height animation
  const tabsHeight = useSharedValue(initialTabsHeight);
  const tabsAnimatedStyle = useAnimatedStyle(() => ({
    height: tabsHeight.value,
    overflow: 'hidden'
  }));

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    if (firstLoad.current) {
      fetchAllCoins().then(() => (firstLoad.current = false));
    }
  }, []);

  const handleEndReached = useCallback(() => {
    if (!loadingRef.current && hasMore) {
      fetchAllCoins(true, true);
    }
  }, [hasMore]);

  const activateSearch = () => {
    setIsSearchActive(true);
    tabsHeight.value = withTiming(0, { duration: 300 });
  };

  const deactivateSearch = () => {
    tabsHeight.value = withTiming(initialTabsHeight, { duration: 300 });
    setTimeout(() => {
      setIsSearchActive(false);
      setSearchQuery('');
    }, 300);
  };

  if (loading && firstLoad.current) {
    return (
      <View style={styles.centerContainer}>
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

      {/* Reanimated Tabs container */}
      <Animated.View style={tabsAnimatedStyle}>
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
          <TopTabs.Screen name="⭐ Featured" component={CategoryTab} initialParams={{ category: 'featured' }} />
          <TopTabs.Screen name="🚀 Top Gainers" component={CategoryTab} initialParams={{ category: 'topGainers' }} />
          <TopTabs.Screen name="🚩 Top Losers" component={CategoryTab} initialParams={{ category: 'topLosers' }} />
        </TopTabs.Navigator>
      </Animated.View>

      {/* Header / Search Section */}
      <View style={{ flex: 1 }}>
        {!isSearchActive ? (
          <View style={styles.coinListingHeader}>
            <View style={styles.allCoinsWrapper}>
              <Text style={styles.allCoins}>All Coins</Text>
              <View style={styles.allCoinsUnderline} />
            </View>
            <View style={styles.searchContainer}>
              <TextInput
                placeholder="Search..."
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onFocus={activateSearch}
                placeholderTextColor={colors.textSecondary}
              />
              <SeachIcon width={moderateScale(20)} height={moderateScale(20)} />
            </View>
          </View>
        ) : (
          <View style={[styles.coinListingHeader, { justifyContent: 'center', backgroundColor: colors.background,  marginTop: verticalScale(10) }]}>  
            <View style={[styles.searchContainer, { flex: 1 }]}>  
              <TextInput
                placeholder="Search..."
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
                placeholderTextColor={colors.textSecondary}
              />
              <TouchableOpacity onPress={deactivateSearch} style={{ padding: moderateScale(4) }}>
                <XIcon color={colors.text}/>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <FlatList
          data={filteredCoins}
          renderItem={({ item }) => <CoinListItem coin={item} />}
          keyExtractor={item => item.id}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={150}
          showsVerticalScrollIndicator={false}
          style={styles.allCoinsListView}
          ListFooterComponent={() => {
            if (searchQuery) return null;
            if (loading && hasMore) return <ActivityIndicator style={{ padding: 10 }} color={colors.green} />;
            return <Text style={{ textAlign: 'center', padding: 10 }}>No more coins to show</Text>;
          }}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.3}
          extraData={searchQuery}
          keyboardShouldPersistTaps="handled"
          removeClippedSubviews
        />
      </View>
    </View>
  );
};

export default MarketScreen;
