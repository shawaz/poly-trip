export type Direction = 'up' | 'down';

export interface Coin {
  symbol: string;
  label: string;
  bgColor: string;
  direction: Direction;
}

export interface CardData {
  key: string;
  sNum: number;
  name: string;
  tf: string;
  capital: number;
  trades: number;
  wins: number;
  lost: number;
  pnl: number;
  balance: number;
  peak: number;
  bust: number;
  target: number;
  winRate: number;
  generation: number;
  isRunning: boolean;
  rewritten: boolean;
  prevWinRate: number | null;
  coins: Coin[];
}

export type Groups = CardData[][];

export interface LogEntry {
  id: number;
  time: string;
  msg: string;
  type: 'rw' | 'trade';
}
