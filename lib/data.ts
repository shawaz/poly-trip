import type { CardData, Coin, Groups } from './types';

export const TIMEFRAMES = ['5M', '15M', '1H', '4H'] as const;

export const STRATEGY_NAMES: Record<number, string> = {
  1: 'Momentum',
  2: 'EMA Cross',
  3: 'Orderbook',
  4: 'Contrarian',
  5: 'Ensemble',
  6: 'Trend',
  7: 'Arbitrage',
  8: 'Breakout',
  9: 'Whale',
  10: 'Scalp',
};

export const STRATEGY_COUNT = 10;

export const COINS: Omit<Coin, 'direction'>[] = [
  { symbol: 'BTC', label: '₿', bgColor: '#F7931A' },
  { symbol: 'ETH', label: 'Ξ', bgColor: '#627EEA' },
  { symbol: 'SOL', label: '◎', bgColor: '#9945FF' },
  { symbol: 'XRP', label: '✕', bgColor: '#346AA9' },
];

interface StrategyBacktest {
  wins: number;
  losses: number;
  winRate: number;
  pnl: number;
}

const PAPER_DATA: Record<number, Record<string, StrategyBacktest>> = {
  1: {
    '5M':  { wins: 5, losses: 12, winRate: 29, pnl: -85 },
    '15M': { wins: 3, losses: 8, winRate: 27, pnl: -62 },
    '1H':  { wins: 2, losses: 4, winRate: 33, pnl: -28 },
    '4H':  { wins: 1, losses: 2, winRate: 33, pnl: -15 },
  },
  2: {
    '5M':  { wins: 8, losses: 15, winRate: 35, pnl: -120 },
    '15M': { wins: 4, losses: 7, winRate: 36, pnl: -55 },
    '1H':  { wins: 2, losses: 3, winRate: 40, pnl: -22 },
    '4H':  { wins: 1, losses: 2, winRate: 33, pnl: -18 },
  },
  3: {
    '5M':  { wins: 45, losses: 42, winRate: 52, pnl: 180 },
    '15M': { wins: 22, losses: 20, winRate: 52, pnl: 95 },
    '1H':  { wins: 8, losses: 7, winRate: 53, pnl: 42 },
    '4H':  { wins: 4, losses: 3, winRate: 57, pnl: 28 },
  },
  4: {
    '5M':  { wins: 89, losses: 22, winRate: 80, pnl: 1250 },
    '15M': { wins: 42, losses: 18, winRate: 70, pnl: 580 },
    '1H':  { wins: 15, losses: 10, winRate: 60, pnl: 125 },
    '4H':  { wins: 6, losses: 4, winRate: 60, pnl: 68 },
  },
  5: {
    '5M':  { wins: 18, losses: 24, winRate: 43, pnl: -95 },
    '15M': { wins: 8, losses: 12, winRate: 40, pnl: -65 },
    '1H':  { wins: 3, losses: 5, winRate: 38, pnl: -42 },
    '4H':  { wins: 1, losses: 2, winRate: 33, pnl: -25 },
  },
  6: {
    '5M':  { wins: 35, losses: 38, winRate: 48, pnl: -85 },
    '15M': { wins: 18, losses: 20, winRate: 47, pnl: -55 },
    '1H':  { wins: 6, losses: 8, winRate: 43, pnl: -38 },
    '4H':  { wins: 3, losses: 4, winRate: 43, pnl: -22 },
  },
  7: {
    '5M':  { wins: 28, losses: 32, winRate: 47, pnl: -75 },
    '15M': { wins: 12, losses: 15, winRate: 44, pnl: -48 },
    '1H':  { wins: 5, losses: 7, winRate: 42, pnl: -32 },
    '4H':  { wins: 2, losses: 3, winRate: 40, pnl: -18 },
  },
  8: {
    '5M':  { wins: 32, losses: 35, winRate: 48, pnl: -65 },
    '15M': { wins: 15, losses: 18, winRate: 45, pnl: -42 },
    '1H':  { wins: 6, losses: 8, winRate: 43, pnl: -28 },
    '4H':  { wins: 2, losses: 3, winRate: 40, pnl: -15 },
  },
  9: {
    '5M':  { wins: 25, losses: 32, winRate: 44, pnl: -120 },
    '15M': { wins: 12, losses: 16, winRate: 43, pnl: -68 },
    '1H':  { wins: 5, losses: 7, winRate: 42, pnl: -35 },
    '4H':  { wins: 2, losses: 4, winRate: 33, pnl: -22 },
  },
  10: {
    '5M':  { wins: 8, losses: 52, winRate: 13, pnl: -580 },
    '15M': { wins: 4, losses: 22, winRate: 15, pnl: -280 },
    '1H':  { wins: 2, losses: 10, winRate: 17, pnl: -125 },
    '4H':  { wins: 1, losses: 5, winRate: 17, pnl: -65 },
  },
};

export function makeCard(sNum: number, tf: string, running: boolean): CardData {
  const data = PAPER_DATA[sNum]?.[tf] || { wins: 10, losses: 10, winRate: 50, pnl: 0 };
  
  return {
    key: `T${sNum}-${tf}`,
    sNum,
    name: STRATEGY_NAMES[sNum] ?? `Strategy ${sNum}`,
    tf,
    capital: 1000,
    trades: data.wins + data.losses,
    wins: data.wins,
    lost: data.losses,
    pnl: data.pnl,
    balance: 1000 + data.pnl,
    peak: Math.max(Math.abs(data.pnl) + 50, 10),
    bust: 500,
    target: 2000,
    winRate: data.winRate,
    generation: 1,
    isRunning: running,
    rewritten: false,
    prevWinRate: null,
    coins: COINS.map((c, i) => ({
      ...c,
      direction: i % 2 === 0 ? 'up' : 'down',
    })),
  };
}

export function initData(): Groups {
  return Array.from({ length: STRATEGY_COUNT }, (_, si) =>
    TIMEFRAMES.map((tf) => makeCard(si + 1, tf, false))
  );
}

export function aiRewrite(c: CardData): CardData {
  const improvement = Math.floor(Math.random() * 5) + 2;
  const newWinRate = Math.min(c.winRate + improvement, 95);
  const newTrades = Math.floor(c.trades * 1.2);
  const newWins = Math.floor((newWinRate / 100) * newTrades);
  const newPnl = Math.floor(c.pnl * (1 + improvement / 50));
  
  return {
    ...c,
    wins: newWins,
    lost: newTrades - newWins,
    pnl: newPnl,
    balance: c.capital + newPnl,
    winRate: newWinRate,
    generation: c.generation + 1,
    rewritten: true,
    prevWinRate: c.winRate,
    coins: c.coins.map((x) => ({
      ...x,
      direction: Math.random() > 0.4 ? 'up' : 'down',
    })),
  };
}
