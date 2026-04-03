import type { Coin } from '@/lib/types';

interface Props {
  coin: Coin;
  onToggle: (dir: 'up' | 'down') => void;
}

export default function CoinToggle({ coin, onToggle }: Props) {
  const isUp = coin.direction === 'up';

  return (
    <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
      {/* Coin icon */}
      <div
        className="w-9 h-9 rounded-[10px] flex items-center justify-center text-[15px] font-bold text-white shadow-sm"
        style={{ backgroundColor: coin.bgColor }}
      >
        {coin.label}
      </div>

      {/* Up/Down toggle */}
      <div className="flex gap-1">
        <button
          onClick={() => onToggle('up')}
          className={`w-[26px] h-[20px] rounded-[4px] text-[9px] font-bold flex items-center justify-center transition-all duration-150 ${
            isUp
              ? 'bg-[#00d585]/20 border border-[#00d585]/40 text-[#00d585]'
              : 'bg-white/5 border border-white/10 text-white/30'
          }`}
        >
          ▲
        </button>
        <button
          onClick={() => onToggle('down')}
          className={`w-[26px] h-[20px] rounded-[4px] text-[9px] font-bold flex items-center justify-center transition-all duration-150 ${
            !isUp
              ? 'bg-red-500/20 border border-red-500/40 text-red-400'
              : 'bg-white/5 border border-white/10 text-white/30'
          }`}
        >
          ▼
        </button>
      </div>
    </div>
  );
}
