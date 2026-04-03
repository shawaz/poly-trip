import { createConvexHref, useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
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

export function useTrades(limit = 100) {
  return useQuery(api.trades.list, { limit });
}

export function useTradeStats() {
  return useQuery(api.trades.getStats);
}

export function useStrategies() {
  return useQuery(api.strategies.list);
}

export function useTopStrategies(limit = 10) {
  return useQuery(api.strategy_metrics.getTopByWinRate, { limit });
}

export function useAiDecisions() {
  return useQuery(api.ai_decisions.list);
}

export function usePendingAiDecisions() {
  return useQuery(api.ai_decisions.getPending);
}

export const startBot = useMutation(api.bot.start);
export const stopBot = useMutation(api.bot.stop);

export const analyzeStrategy = useMutation(api.ai.analyzeStrategy);
export const approveAiDecision = useMutation(api.ai.approveDecision);
export const rejectAiDecision = useMutation(api.ai.rejectDecision);

export function makeCard(
  sNum: number,
  tf: string,
  running: boolean,
  metrics?: { winRate: number; totalTrades: number; totalPnl: number }
): CardData {
  const wins = metrics?.totalTrades ? Math.floor((metrics.winRate / 100) * metrics.totalTrades) : 10;
  const losses = metrics?.totalTrades ? metrics.totalTrades - wins : 10;
  const pnl = metrics?.totalPnl ?? 0;
  
  return {
    key: `T${sNum}-${tf}`,
    sNum,
    name: STRATEGY_NAMES[sNum] ?? `Strategy ${sNum}`,
    tf,
    capital: 1000,
    trades: wins + losses,
    wins,
    lost: losses,
    pnl,
    balance: 1000 + pnl,
    peak: Math.max(Math.abs(pnl) + 50, 1000),
    bust: 500,
    target: 2000,
    winRate: metrics?.winRate ?? 50,
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
