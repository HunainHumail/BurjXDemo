import { create } from 'zustand';

interface Coin {
    productId: number;
    id: string;
    name: string;
    image: string;
    currentPrice: number;
    priceChangePercentage24h: number;
    sparkline: number[];
    marketCap: number;
    tradingVolume: number;
    symbol: string;
}

interface MarketState {
    allCoins: Coin[];
    filteredCoins: Coin[];
    searchQuery: string;
    hasMore: boolean;
    loading: boolean;
    error: string | null;
    currentPage: number;
    selectedCoinId: number | null;
    selectedTimeframe: string;
    ohlcData: any[];
    yDomain: [number, number];
    fetchAllCoins: (silent?: boolean, isLoadMore?: boolean) => Promise<void>;
    loadMore: () => void;
    setSearchQuery: (query: string) => void;
    setSelectedCoin: (productId: number) => void;
    setSelectedTimeframe: (timeframe: string) => void;
    fetchOHLCData: () => Promise<void>;
    featured: Coin[];
    topGainers: Coin[];
    topLosers: Coin[];
}

export const useMarketStore = create<MarketState>((set, get) => ({
    allCoins: [],
    filteredCoins: [],
    searchQuery: '',
    hasMore: true,
    loading: false,
    error: null,
    currentPage: 1,
    selectedCoinId: null,
    selectedTimeframe: '30D',
    ohlcData: [],
    yDomain: [0, 100],
    featured: [],
    topGainers: [],
    topLosers: [],

    fetchAllCoins: async (silent = false, isLoadMore = false) => {
        const state = get();
        if (state.loading) return;

        !silent && set({ loading: true, error: null });

        try {
            const targetPage = isLoadMore ? state.currentPage + 1 : 1;
            const pageSize = 10;
            const res = await fetch(
                `https://coingeko.burjx.com/coin-prices-all?currency=usd&page=${targetPage}&pageSize=${pageSize}`
            );
            if (!res.ok) throw new Error('Failed to fetch');
            const json = await res.json();
            const newCoins: Coin[] = json.data || [];
            const mergedCoins = isLoadMore ? [...state.allCoins, ...newCoins] : newCoins;

            const calculateList = (sortFn: (a: Coin, b: Coin) => number) =>
                mergedCoins.slice().sort(sortFn).slice(0, 20);

            set({
                allCoins: mergedCoins,
                filteredCoins: mergedCoins,
                currentPage: targetPage,
                hasMore: newCoins.length === pageSize,
                featured: calculateList((a, b) => b.marketCap - a.marketCap),
                topGainers: calculateList((a, b) => b.priceChangePercentage24h - a.priceChangePercentage24h),
                topLosers: calculateList((a, b) => a.priceChangePercentage24h - b.priceChangePercentage24h),
            });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to fetch coins' });
        } finally {
            !silent && set({ loading: false });
        }
    },

    loadMore: () => {
        const { hasMore, loading } = get();
        if (hasMore && !loading) get().fetchAllCoins(true, true);
    },

    setSearchQuery: (query: string) => {
        const q = query.trim().toLowerCase();
        const { allCoins } = get();
        const filtered = q
            ? allCoins.filter(c =>
                c.name.toLowerCase().includes(q) ||
                c.symbol.toLowerCase().includes(q)
            )
            : allCoins;
        set({ searchQuery: query, filteredCoins: filtered });
    },

    setSelectedCoin: (productId: number) => {
        set({ selectedCoinId: productId });
        get().fetchOHLCData();
    },

    setSelectedTimeframe: (timeframe: string) => {
        set({ selectedTimeframe: timeframe });
        if (get().selectedCoinId) {
            get().fetchOHLCData();
        }
    },

    fetchOHLCData: async () => {
        const { selectedCoinId, selectedTimeframe } = get();
        if (!selectedCoinId) return;

        set({ loading: true, error: null });

        try {
            const daysMap = { '1D': 1, '7D': 7, '30D': 30, '90D': 90, '1Y': 365, 'ALL': 'max' };
            const response = await fetch(
                `https://coingeko.burjx.com/coin-ohlc?productId=${selectedCoinId}&days=${daysMap[selectedTimeframe]}`
            );
            const json = await response.json();
            const ohlc = json.map(item => ({
                x: new Date(item.date),
                open: +item.usd.open,
                high: +item.usd.high,
                low: +item.usd.low,
                close: +item.usd.close,
            }));
            const lows = ohlc.map(d => d.low);
            const highs = ohlc.map(d => d.high);
            const minVal = Math.min(...lows);
            const maxVal = Math.max(...highs);
            set({
                ohlcData: ohlc,
                yDomain: [minVal * 0.98, maxVal * 1.02],
                loading: false,
            });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },
}));