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
    displayedCount: number;
    searchQuery: string;
    hasMore: boolean;
    loading: boolean;
    error: string | null;
    fetchAllCoins: (silent?: boolean, isLoadMore?: boolean) => Promise<void>;
    loadMore: () => void;
    setSearchQuery: (query: string) => void;
    featured: Coin[];
    topGainers: Coin[];
    topLosers: Coin[];
    currentPage: number;
    totalPages: number;
}

export const useMarketStore = create<MarketState>((set, get) => ({
    // —— initial state ——  
    filteredCoins: [],
    displayedCount: 10,
    searchQuery: '',
    loading: false,
    error: null,
    totalPages: 1,
    allCoins: [],
    currentPage: 1,
    hasMore: true,
    totalCoins: 0,

    fetchAllCoins: async (silent = false, loadMore = false) => {
        const state = get();
        if (state.loading) return;

        !silent && set({ loading: true, error: null });

        try {
            const targetPage = loadMore ? state.currentPage + 1 : 1;
            const pageSize = 10;

            const res = await fetch(
                `https://coingeko.burjx.com/coin-prices-all?currency=usd&page=${targetPage}&pageSize=${pageSize}`
            );

            if (!res.ok) throw new Error('Failed to fetch');
            const json = await res.json();
            const newCoins: Coin[] = json.data || [];
            const mergedCoins = loadMore
                ? [...state.allCoins, ...newCoins]
                : newCoins;

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
        hasMore && !loading && get().fetchAllCoins(true, true);
    },


    setSearchQuery: (query: string) => {
        const q = query.trim().toLowerCase();
        const { allCoins } = get();

        const filtered = q
            ? allCoins.filter(c =>
                c.name.toLowerCase().includes(q) ||
                c.symbol.toLowerCase().includes(q)
            ) : allCoins;

        set({
            searchQuery: query,
            filteredCoins: filtered
        });
    },
    featured: [],
    topGainers: [],
    topLosers: [],
}));
