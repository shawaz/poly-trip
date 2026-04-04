import type { CardData } from '@/lib/types';
import WinRateCircle from './WinRateCircle';
import CoinToggle from './CoinToggle';

interface Props {
  data: CardData;
  onToggle: (key: string) => void;
  onCoinDir: (key: string, coinIndex: number, dir: 'up' | 'down') => void;
}

function Divider() {
  return <div className="h-px bg-white/[0.07] -mx-4" />;
}

export default function StrategyCard({ data, onToggle, onCoinDir }: Props) {
  const {
    key, sNum, name, tf, capital, trades, wins, lost,
    pnl, balance, peak, bust, target, winRate,
    isRunning, generation, coins, rewritten, prevWinRate,
  } = data;

  const pnlPos = pnl >= 0;
  const pct = Math.min(Math.max((pnl / (target - capital)) * 100, 0), 100);

  return (
    <div
      className={`rounded-2xl overflow-hidden flex flex-col ${
        isRunning
          ? 'shadow-[0_0_0_1px_rgba(0,213,133,0.3),0_0_20px_rgba(0,213,133,0.06)]'
          : 'shadow-[0_0_0_1px_rgba(255,255,255,0.07)]'
      }`}
      style={{ backgroundColor: '#1c2428' }}
    >
      {/* Running top bar */}
      {isRunning && (
        <div className="h-[3px] bg-[#00d585]" />
      )}

      <div className="flex flex-col gap-0 p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-[15px]">T{sNum}</span>
            <div className="w-px h-4 bg-white/20" />
            <span className="text-white font-semibold text-[15px]">{tf}</span>
            <div className="w-px h-4 bg-white/20" />
            <span className="text-white/70 font-semibold text-[13px] tracking-wide">
              Capital: ${capital.toLocaleString()}
            </span>
          </div>
          <WinRateCircle rate={winRate} />
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-white/40 text-[11px] font-medium">{name}</span>
          {isRunning ? (
            <span className="flex items-center gap-1.5 text-[10px] font-semibold text-[#00d585] ml-auto">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00d585] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00d585]" />
              </span>
              LIVE
            </span>
          ) : (
            <span className="ml-auto text-[10px] font-medium text-white/30">
              {generation > 1 ? `Gen ${generation}` : 'Idle'}
            </span>
          )}
        </div>

        <Divider />

        {/* Row 1: Trades / Peak / Bust */}
        <div className="grid grid-cols-3 py-2.5 gap-x-2">
          <div>
            <span className="text-white/60 text-[12px] font-semibold">Trades: </span>
            <span className="text-white text-[12px] font-semibold">{trades}</span>
          </div>
          <div>
            <span className="text-white/60 text-[12px] font-semibold">Peak: </span>
            <span className="text-white text-[12px] font-semibold">+${peak}</span>
          </div>
          <div>
            <span className="text-white/60 text-[12px] font-semibold">Bust: </span>
            <span className="text-white text-[12px] font-semibold">+${bust}</span>
          </div>
        </div>

        {/* Row 2: P&L / Wins / Lost */}
        <div className="grid grid-cols-3 pb-2.5 gap-x-2">
          <div>
            <span className="text-white/60 text-[12px] font-semibold">P&L: </span>
            <span
              className="text-[12px] font-semibold"
              style={{ color: pnlPos ? '#00d585' : '#ef4444' }}
            >
              {pnlPos ? '+' : ''}${pnl}
            </span>
          </div>
          <div>
            <span className="text-white/60 text-[12px] font-semibold">Wins: </span>
            <span className="text-[12px] font-semibold text-[#00d585]">{wins}</span>
          </div>
          <div>
            <span className="text-white/60 text-[12px] font-semibold">Lost: </span>
            <span className="text-[12px] font-semibold text-red-400">{lost}</span>
          </div>
        </div>

        <Divider />

        {/* Live P&L + Target */}
        <div className="flex items-center justify-between py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-white/60 text-[12px] font-semibold">Live P&L:</span>
            <span
              className="text-[12px] font-semibold"
              style={{ color: pnlPos ? '#00d585' : '#ef4444' }}
            >
              {pnlPos ? '+' : ''}${pnl}
            </span>
          </div>
          <span className="text-white/40 text-[12px] font-semibold">
            Target: +${target.toLocaleString()}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-[5px] rounded-full bg-white/10 mb-3 overflow-hidden">
          <div
            className="h-full rounded-full bg-[#00d585] transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>

        <Divider />

        {/* Coin toggles */}
        <div className="flex items-center gap-3 py-3 overflow-x-auto scrollbar-none">
          {coins.map((coin, ci) => (
            <CoinToggle
              key={coin.symbol}
              coin={coin}
              onToggle={(dir) => onCoinDir(key, ci, dir)}
            />
          ))}
        </div>

        {/* AI rewrite note */}
        {rewritten && prevWinRate !== null && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#00d585]/10 border border-[#00d585]/20 mb-3">
            <span className="text-[11px]">⚡</span>
            <span className="text-[11px] font-semibold text-[#00d585]">
              AI rewrite · {prevWinRate}% → {winRate}% win rate
            </span>
          </div>
        )}

        <Divider />

        {/* Action button */}
        <button
          onClick={() => onToggle(key)}
          className={`mt-3 w-full h-11 rounded-lg text-[15px] font-bold tracking-widest transition-all duration-150 active:scale-[0.98] ${
            isRunning
              ? 'bg-[#3c262b] text-red-400 border border-red-500/20'
              : 'bg-[#00d585] text-[#00321f]'
          }`}
        >
          {isRunning ? 'STOP' : 'START'}
        </button>
      </div>
    </div>
  );
}
