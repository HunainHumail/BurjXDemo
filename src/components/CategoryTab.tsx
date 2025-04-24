import { useRoute } from "@react-navigation/native";
import { useMarketStore } from "../stores/marketStore";
import { FlatList, View } from "react-native";
import { useTheme } from "../themes/useTheme";
import CoinBox from "./CoinBox";

const CategoryTab = () => {
  const route = useRoute();
  const { colors } = useTheme()
  const { category } = route.params;
  const coins = useMarketStore(state => state[category]);
  console.log('COINS: ', coins)

  return (
      <FlatList
        data={coins}
        renderItem={({ item }) => <CoinBox coin={item} />}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10, justifyContent: 'center' }}
        style={{ backgroundColor: colors.background }}
      />
  );
};

export default CategoryTab