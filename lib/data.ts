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
    '5M':  { wins: 326, losses: 1425, winRate: 19, pnl: -30900 },
    '15M': { wins: 96, losses: 491, winRate: 16, pnl: -10727 },
    '1H':  { wins: 19, losses: 16, winRate: 54, pnl: 51 },
    '4H':  { wins: 8, losses: 5, winRate: 62, pnl: 120 },
  },
  2: {
    '5M':  { wins: 45, losses: 89, winRate: 34, pnl: -120 },
    '15M': { wins: 18, losses: 32, winRate: 36, pnl: -85 },
    '1H':  { wins: 8, losses: 12, winRate: 40, pnl: -35 },
    '4H':  { wins: 3, losses: 5, winRate: 38, pnl: -22 },
  },
  3: {
    '5M':  { wins: 2953, losses: 2727, winRate: 52, pnl: 6679 },
    '15M': { wins: 318, losses: 289, winRate: 52, pnl: 786 },
    '1H':  { wins: 25, losses: 21, winRate: 54, pnl: 44 },
    '4H':  { wins: 12, losses: 10, winRate: 55, pnl: 65 },
  },
  4: {
    '5M':  { wins: 20716, losses: 5047, winRate: 80, pnl: 422216 },
    '15M': { wins: 1956, losses: 839, winRate: 70, pnl: 30471 },
    '1H':  { wins: 93, losses: 65, winRate: 59, pnl: 515 },
    '4H':  { wins: 45, losses: 28, winRate: 62, pnl: 280 },
  },
  5: {
    '5M':  { wins: 425, losses: 539, winRate: 44, pnl: -3390 },
    '15M': { wins: 10, losses: 10, winRate: 50, pnl: -12 },
    '1H':  { wins: 4, losses: 6, winRate: 40, pnl: -65 },
    '4H':  { wins: 2, losses: 3, winRate: 40, pnl: -35 },
  },
  6: {
    '5M':  { wins: 2402, losses: 2570, winRate: 48, pnl: -3914 },
    '15M': { wins: 517, losses: 526, winRate: 50, pnl: -615 },
    '1H':  { wins: 24, losses: 29, winRate: 45, pnl: -300 },
    '4H':  { wins: 12, losses: 15, winRate: 44, pnl: -65 },
  },
  7: {
    '5M':  { wins: 1316, losses: 1391, winRate: 49, pnl: -1644 },
    '15M': { wins: 71, losses: 79, winRate: 47, pnl: -120 },
    '1H':  { wins: 22, losses: 27, winRate: 45, pnl: -85 },
    '4H':  { wins: 10, losses: 14, winRate: 42, pnl: -55 },
  },
  8: {
    '5M':  { wins: 2372, losses: 2523, winRate: 48, pnl: -3557 },
    '15M': { wins: 48, losses: 55, winRate: 47, pnl: -95 },
    '1H':  { wins: 18, losses: 22, winRate: 45, pnl: -72 },
    '4H':  { wins: 8, losses: 12, winRate: 40, pnl: -48 },
  },
  9: {
    '5M':  { wins: 320, losses: 380, winRate: 46, pnl: -250 },
    '15M': { wins: 65, losses: 78, winRate: 45, pnl: -135 },
    '1H':  { wins: 28, losses: 35, winRate: 44, pnl: -92 },
    '4H':  { wins: 12, losses: 18, winRate: 40, pnl: -68 },
  },
  10: {
    '5M':  { wins: 1063, losses: 10134, winRate: 9, pnl: -240437 },
    '15M': { wins: 149, losses: 624, winRate: 19, pnl: -12689 },
    '1H':  { wins: 8, losses: 42, winRate: 16, pnl: -680 },
    '4H':  { wins: 3, losses: 22, winRate: 12, pnl: -420 },
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
