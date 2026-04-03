'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import type { CardData, Groups } from '@/lib/types';
import { initData, TIMEFRAMES } from '@/lib/data';

type Theme = 'dark' | 'light';
type SortBy = 'default' | 'winrate' | 'pnl' | 'balance';
type Phase = 1 | 2 | 3;

const COINS = [
  { symbol: 'BTC', label: '₿', color: '#F7931A' },
  { symbol: 'ETH', label: 'Ξ', color: '#627EEA' },
  { symbol: 'SOL', label: '◎', color: '#9945FF' },
  { symbol: 'XRP', label: '✕', color: '#346AA9' },
];

interface StrategySettings {
  balance: number;
  sl: number;
  tp: number;
  perTrade: number;
  maxPositions: number;
  riskPercent: number;
}

function SettingsModal({
  settings,
  onSave,
  onClose,
  theme,
}: {
  settings: StrategySettings;
  onSave: (s: StrategySettings) => void;
  onClose: () => void;
  theme: Theme;
}) {
  const [form, setForm] = useState(settings);
  const isDark = theme === 'dark';
  
  const bg = isDark ? 'bg-[#0a0a0a]' : 'bg-white';
  const border = isDark ? 'border-white/10' : 'border-gray-200';
  const text = isDark ? 'text-white' : 'text-gray-900';
  const textMuted = isDark ? 'text-white/50' : 'text-gray-500';
  const inputBg = isDark ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200';
  const inputText = isDark ? 'text-white' : 'text-gray-900';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className={`w-full max-w-md rounded-2xl border ${border} ${bg} p-6 shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className={`text-lg font-semibold ${text}`}>Strategy Settings</h2>
          <button onClick={onClose} className={`p-1 ${textMuted} hover:${text}`}>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`mb-1 block text-xs ${textMuted}`}>Balance ($)</label>
              <input
                type="number"
                value={form.balance}
                onChange={(e) => setForm({ ...form, balance: parseFloat(e.target.value) || 0 })}
                className={`w-full rounded-lg border ${inputBg} px-3 py-2 text-sm ${inputText} focus:outline-none focus:ring-2 focus:ring-[#00d585]`}
              />
            </div>
            <div>
              <label className={`mb-1 block text-xs ${textMuted}`}>Per Trade ($)</label>
              <input
                type="number"
                value={form.perTrade}
                onChange={(e) => setForm({ ...form, perTrade: parseFloat(e.target.value) || 0 })}
                className={`w-full rounded-lg border ${inputBg} px-3 py-2 text-sm ${inputText} focus:outline-none focus:ring-2 focus:ring-[#00d585]`}
              />
            </div>
            <div>
              <label className={`mb-1 block text-xs ${textMuted}`}>Stop Loss (%)</label>
              <input
                type="number"
                step="0.1"
                value={form.sl}
                onChange={(e) => setForm({ ...form, sl: parseFloat(e.target.value) || 0 })}
                className={`w-full rounded-lg border ${inputBg} px-3 py-2 text-sm ${inputText} focus:outline-none focus:ring-2 focus:ring-[#00d585]`}
              />
            </div>
            <div>
              <label className={`mb-1 block text-xs ${textMuted}`}>Take Profit (%)</label>
              <input
                type="number"
                step="0.1"
                value={form.tp}
                onChange={(e) => setForm({ ...form, tp: parseFloat(e.target.value) || 0 })}
                className={`w-full rounded-lg border ${inputBg} px-3 py-2 text-sm ${inputText} focus:outline-none focus:ring-2 focus:ring-[#00d585]`}
              />
            </div>
            <div>
              <label className={`mb-1 block text-xs ${textMuted}`}>Max Positions</label>
              <input
                type="number"
                value={form.maxPositions}
                onChange={(e) => setForm({ ...form, maxPositions: parseInt(e.target.value) || 0 })}
                className={`w-full rounded-lg border ${inputBg} px-3 py-2 text-sm ${inputText} focus:outline-none focus:ring-2 focus:ring-[#00d585]`}
              />
            </div>
            <div>
              <label className={`mb-1 block text-xs ${textMuted}`}>Risk (%)</label>
              <input
                type="number"
                step="0.1"
                value={form.riskPercent}
                onChange={(e) => setForm({ ...form, riskPercent: parseFloat(e.target.value) || 0 })}
                className={`w-full rounded-lg border ${inputBg} px-3 py-2 text-sm ${inputText} focus:outline-none focus:ring-2 focus:ring-[#00d585]`}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-[#00d585] py-2.5 text-sm font-semibold text-black transition-all hover:bg-[#00d585]/90"
          >
            Save Settings
          </button>
        </form>
      </div>
    </div>
  );
}

function Dropdown({
  label,
  value,
  options,
  onChange,
  theme,
}: {
  label: string;
  value: string | null;
  options: { value: string; label: string }[];
  onChange: (v: string | null) => void;
  theme: Theme;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isDark = theme === 'dark';

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const activeBg = isDark ? 'bg-white text-black' : 'bg-gray-900 text-white';
  const cardBg = isDark ? 'bg-white/5' : 'bg-gray-100';
  const border = isDark ? 'border-white/5' : 'border-gray-200';
  const text = isDark ? 'text-white' : 'text-gray-900';
  const textMuted = isDark ? 'text-white/60' : 'text-gray-500';

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 rounded-lg ${cardBg} px-3 py-2 text-sm ${text} transition-all hover:opacity-80`}
      >
        <span className={textMuted}>{label}:</span>
        <span className="font-medium">{selected?.label || 'All'}</span>
        <svg className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className={`absolute left-0 top-full z-50 mt-1 min-w-[140px] rounded-lg border ${border} ${isDark ? 'bg-[#1a1a1a]' : 'bg-white'} py-1 shadow-xl`}>
          <button
            onClick={() => { onChange(null); setOpen(false); }}
            className={`flex w-full px-3 py-2 text-sm ${!value ? activeBg : text} hover:opacity-80`}
          >
            All
          </button>
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`flex w-full px-3 py-2 text-sm ${value === opt.value ? activeBg : text} hover:opacity-80`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function CoinIndicator({ coin, active }: { coin: typeof COINS[0]; active: boolean }) {
  return (
    <div className="flex items-center gap-1">
      <span style={{ color: coin.color }}>{coin.label}</span>
      <span className={`text-[10px] ${active ? 'text-white' : 'text-white/30'}`}>
        {active ? '●' : '○'}
      </span>
    </div>
  );
}

interface StrategyCardProps {
  data: CardData;
  onToggle: () => void;
  onSettings: () => void;
  theme: Theme;
}

function StrategyCard({ data, onToggle, onSettings, theme }: StrategyCardProps) {
  const { sNum, tf, trades, wins, pnl, balance, winRate, isRunning } = data;
  const isDark = theme === 'dark';
  
  const bg = isDark ? 'bg-[#0a0a0a]' : 'bg-white';
  const border = isDark ? 'border-white/5' : 'border-gray-200';
  const hoverBorder = isDark ? 'hover:border-white/10' : 'hover:border-gray-300';
  const text = isDark ? 'text-white' : 'text-gray-900';
  const textMuted = isDark ? 'text-white/40' : 'text-gray-400';
  const cardBg = isDark ? 'bg-white/5' : 'bg-gray-100';
  
  const wrColor = winRate >= 70 ? '#00d585' : winRate >= 50 ? '#f59e0b' : '#ef4444';
  const pnlColor = pnl >= 0 ? '#00d585' : '#ef4444';
  const btnBg = isRunning
    ? (isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600')
    : (isDark ? 'bg-white/10 text-white/60' : 'bg-gray-200 text-gray-600');

  return (
    <div className={`group relative overflow-hidden rounded-2xl border ${border} ${bg} p-5 transition-all ${hoverBorder}`}>
      {isRunning && <div className="absolute left-0 top-0 h-[2px] w-full bg-[#00d585]" />}

      <div className="mb-4 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-bold ${text}`}>T{sNum}</span>
            <span className={`rounded ${cardBg} px-1.5 py-0.5 text-[10px] font-medium ${textMuted}`}>{tf}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold" style={{ color: wrColor }}>{winRate}%</div>
          <div className={`text-[10px] ${textMuted}`}>win rate</div>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {COINS.map((coin, i) => (
          <CoinIndicator key={coin.symbol} coin={coin} active={data.coins[i]?.direction === 'up'} />
        ))}
      </div>

        <div className="mb-4 grid grid-cols-3 gap-2">
          <div className={`rounded-lg ${cardBg} p-2 text-center`}>
            <div className={`text-xs ${textMuted}`}>Trades</div>
            <div className={`text-sm font-semibold ${text}`}>{trades}</div>
          </div>
          <div className={`rounded-lg ${cardBg} p-2 text-center`}>
            <div className={`text-xs ${textMuted}`}>Wins</div>
            <div className="text-sm font-semibold text-[#00d585]">{wins}</div>
          </div>
          <div className={`rounded-lg ${cardBg} p-2 text-center`}>
            <div className={`text-xs ${textMuted}`}>Loss</div>
            <div className="text-sm font-semibold text-red-400">{trades - wins}</div>
          </div>
        </div>

      <div className="mb-4 flex items-end justify-between">
        <div>
          <div className={`text-[10px] ${textMuted} uppercase tracking-wider`}>Balance</div>
          <div className={`text-xl font-bold ${text}`}>${balance.toLocaleString()}</div>
        </div>
        <div className="text-right">
          <div className={`text-[10px] ${textMuted} uppercase tracking-wider`}>P&L</div>
          <div className={`text-lg font-bold`} style={{ color: pnlColor }}>
            {pnl >= 0 ? '+' : ''}${pnl}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onToggle}
          className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${btnBg}`}
        >
          {isRunning ? 'Stop' : 'Start'}
        </button>
        <button
          onClick={onSettings}
          className={`flex items-center justify-center rounded-lg px-3 py-2 ${cardBg} ${textMuted} transition-all hover:opacity-80`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const [groups, setGroups] = useState<Groups>(initData);
  const [theme, setTheme] = useState<Theme>('dark');
  const [filterStrategy, setFilterStrategy] = useState<string | null>(null);
  const [filterTimeframe, setFilterTimeframe] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>('default');
  const [settingsKey, setSettingsKey] = useState<string | null>(null);
  const [settings, setSettings] = useState<Record<string, StrategySettings>>({});
  const [autoCount, setAutoCount] = useState<number>(0);
  const [phase] = useState<Phase>(1);

  const isDark = theme === 'dark';
  const bg = isDark ? 'bg-black' : 'bg-gray-50';
  const border = isDark ? 'border-white/5' : 'border-gray-200';
  const text = isDark ? 'text-white' : 'text-gray-900';
  const textMuted = isDark ? 'text-white/40' : 'text-gray-400';
  const textMutedLight = isDark ? 'text-white/20' : 'text-gray-300';
  const cardBg = isDark ? 'bg-white/5' : 'bg-gray-100';

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleToggle = useCallback((key: string) => {
    setGroups((prev) =>
      prev.map((row) =>
        row.map((card) =>
          card.key === key ? { ...card, isRunning: !card.isRunning } : card
        )
      )
    );
  }, []);

  const openSettings = useCallback((key: string) => {
    if (!settings[key]) {
      setSettings((prev) => ({
        ...prev,
        [key]: { balance: 1000, sl: 2, tp: 5, perTrade: 100, maxPositions: 3, riskPercent: 2 },
      }));
    }
    setSettingsKey(key);
  }, [settings]);

  const saveSettings = useCallback((key: string, newSettings: StrategySettings) => {
    setSettings((prev) => ({ ...prev, [key]: newSettings }));
  }, []);

  const handleAutoSelect = useCallback((count: number) => {
    const sorted = [...groups.flat()].sort((a, b) => b.winRate - a.winRate);
    const topKeys = new Set(sorted.slice(0, count).map((c) => c.key));
    
    setGroups((prev) =>
      prev.map((row) =>
        row.map((card) => ({
          ...card,
          isRunning: topKeys.has(card.key),
        }))
      )
    );
  }, [groups]);

  let allCards = groups.flat();
  
  if (filterStrategy !== null) {
    allCards = allCards.filter((c) => c.sNum === parseInt(filterStrategy!));
  }
  
  if (filterTimeframe !== null) {
    allCards = allCards.filter((c) => c.tf === filterTimeframe);
  }

  if (sortBy === 'winrate') {
    allCards = [...allCards].sort((a, b) => b.winRate - a.winRate);
  } else if (sortBy === 'pnl') {
    allCards = [...allCards].sort((a, b) => b.pnl - a.pnl);
  } else if (sortBy === 'balance') {
    allCards = [...allCards].sort((a, b) => b.balance - a.balance);
  }

  const runningCount = groups.flat().filter((c) => c.isRunning).length;
  const totalPnl = groups.flat().reduce((acc, c) => acc + c.pnl, 0);
  const totalWins = groups.flat().reduce((acc, c) => acc + c.wins, 0);
  const totalTrades = groups.flat().reduce((acc, c) => acc + c.trades, 0);
  const winRate = totalTrades > 0 ? Math.round((totalWins / totalTrades) * 100) : 0;

  const pnlColor = totalPnl >= 0 ? '#00d585' : '#ef4444';

  const strategyOptions = Array.from({ length: 10 }, (_, i) => ({
    value: String(i + 1),
    label: `T${i + 1}`,
  }));

  const timeframeOptions = TIMEFRAMES.map((tf) => ({
    value: tf,
    label: tf,
  }));

  const sortOptions = [
    { value: 'default', label: 'Default' },
    { value: 'winrate', label: 'Win Rate' },
    { value: 'pnl', label: 'P&L' },
    { value: 'balance', label: 'Balance' },
  ];

  return (
    <div className={`min-h-screen ${bg} ${text} transition-colors`}>
      {settingsKey && settings[settingsKey] && (
        <SettingsModal
          settings={settings[settingsKey]}
          onSave={(s) => saveSettings(settingsKey, s)}
          onClose={() => setSettingsKey(null)}
          theme={theme}
        />
      )}

      <header className={`sticky top-0 z-50 border-b ${border} ${isDark ? 'bg-black/80' : 'bg-white/80'} backdrop-blur-xl`}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${isDark ? 'bg-[#00d585]' : 'bg-emerald-500'}`}>
              <span className="text-lg font-bold text-black">P</span>
            </div>
            <div>
              <span className={`text-lg font-medium ${text}`}>PolyTrip</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${cardBg} ${textMuted}`}>
                  Phase {phase}
                </span>
                {phase === 1 && <span className="text-[10px] text-[#00d585]">Paper Trade</span>}
                {phase === 2 && <span className="text-[10px] text-[#f59e0b]">Live Trade</span>}
                {phase === 3 && <span className="text-[10px] text-purple-400">Commercial (10% fee)</span>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-8 text-sm md:flex">
              <div className="flex items-center gap-2">
                <span className={textMuted}>{winRate}%</span>
                <span className={textMutedLight}>WR</span>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ color: pnlColor }}>
                  {totalPnl >= 0 ? '+' : ''}${totalPnl}
                </span>
                <span className={textMutedLight}>P&L</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={text}>{runningCount}</span>
                <span className={textMutedLight}>active</span>
              </div>
            </div>

            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className={`flex h-9 w-9 items-center justify-center rounded-full ${cardBg} transition-all hover:opacity-80`}
            >
              {isDark ? (
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {phase === 1 && (
              <div className={`flex items-center gap-2 rounded-lg ${cardBg} px-4 py-2 text-sm`}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f59e0b] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f59e0b]" />
                </span>
                <span className="text-[#f59e0b]">Bot runs locally</span>
              </div>
            )}

            {phase === 3 && (
              <button className={`flex items-center gap-2 rounded-lg ${cardBg} px-4 py-2 text-sm font-medium ${text} transition-all hover:opacity-80`}>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Login
              </button>
            )}
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <Dropdown
                label="Strategy"
                value={filterStrategy}
                options={strategyOptions}
                onChange={setFilterStrategy}
                theme={theme}
              />
              <Dropdown
                label="Timeframe"
                value={filterTimeframe}
                options={timeframeOptions}
                onChange={setFilterTimeframe}
                theme={theme}
              />
              <Dropdown
                label="Sort"
                value={sortBy}
                options={sortOptions}
                onChange={(v) => setSortBy(v as SortBy)}
                theme={theme}
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (autoCount > 0) {
                      handleAutoSelect(autoCount);
                    }
                  }}
                  className={`flex items-center gap-2 rounded-lg bg-[#00d585] px-3 py-2 text-sm font-medium text-black transition-all hover:bg-[#00d585]/90`}
                >
                  Auto
                </button>
                <select
                  value={autoCount}
                  onChange={(e) => setAutoCount(parseInt(e.target.value))}
                  className={`rounded-lg ${cardBg} px-2 py-2 text-sm ${text} focus:outline-none focus:ring-2 focus:ring-[#00d585]`}
                >
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className={`text-sm font-medium ${textMuted}`}>Strategies</h2>
          <span className={`text-xs ${textMutedLight}`}>{allCards.length} strategies</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {allCards.map((card) => (
            <StrategyCard
              key={card.key}
              data={card}
              onToggle={() => handleToggle(card.key)}
              onSettings={() => openSettings(card.key)}
              theme={theme}
            />
          ))}
        </div>

        {allCards.length === 0 && (
          <div className={`flex flex-col items-center justify-center py-20 text-center ${textMuted}`}>
            <p className="text-lg">No strategies match your filters</p>
          </div>
        )}
      </main>
    </div>
  );
}
