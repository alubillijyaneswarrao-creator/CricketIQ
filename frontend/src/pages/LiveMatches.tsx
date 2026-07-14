import React, { useState } from 'react';
import { Radio, AlertCircle, TrendingUp, Sparkles, User, RefreshCw, BarChart2 } from 'lucide-react';
import { useLiveMatches } from '../hooks/useQueryHooks';

export const LiveMatches: React.FC = () => {
  const { liveMatches, loading } = useLiveMatches();
  const [activeTab, setActiveTab] = useState<'scorecard' | 'predictions'>('scorecard');

  // If no live matches found, show placeholder
  const match = liveMatches && liveMatches.length > 0 ? liveMatches[0] : null;

  return (
    <div className="space-y-8 p-6 md:p-8 max-w-7xl mx-auto">
      
      {/* Live Status Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass-panel border-white/5 shadow-glass">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-red-500/15 text-red-400 animate-pulse">
            <Radio size={20} />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white flex items-center gap-2">
              Live Match Forecasts
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            </h1>
            <p className="text-[10px] text-slate-400 font-semibold">Simulated live feed from Barbados • updates every 10s</p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 border-l border-slate-800 pl-4">
          <button
            onClick={() => setActiveTab('scorecard')}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
              activeTab === 'scorecard' 
                ? 'bg-sky-500/15 text-sky-400 border border-sky-500/20' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Live Scorecard
          </button>
          <button
            onClick={() => setActiveTab('predictions')}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
              activeTab === 'predictions' 
                ? 'bg-sky-500/15 text-sky-400 border border-sky-500/20' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Live AI Prediction
          </button>
        </div>
      </div>

      {!match ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <span className="text-4xl">😴</span>
          <p className="text-xs text-slate-400 font-bold">No matches are currently active. Check back later during tournament hours.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1-2: Scorecard Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {activeTab === 'scorecard' ? (
              <div className="p-6 rounded-2xl glass-panel border-white/5 space-y-6 shadow-glass">
                
                {/* Live scoreboard header */}
                <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-base font-bold text-white leading-tight">{match.title}</h2>
                    <p className="text-[10px] text-slate-500 font-semibold mt-1">{match.venue}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-400">{match.format} Format</span>
                  </div>
                </div>

                {/* Score Big Display */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/40 border border-slate-900">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-sky-400 uppercase tracking-wider">{match.scorecard?.innings_1.team}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-white">{match.scorecard?.innings_1.score}</span>
                      <span className="text-lg text-slate-400 font-semibold">/{match.scorecard?.innings_1.wickets}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-semibold">Overs: {match.scorecard?.innings_1.overs} (max 20)</p>
                  </div>

                  <div className="text-right space-y-1">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Current Run Rate</p>
                    <p className="text-lg font-bold text-slate-300">{(parseFloat(match.scorecard?.innings_1.score || '0') / parseFloat(match.scorecard?.innings_1.overs || '1')).toFixed(2)}</p>
                    <p className="text-[9px] text-indigo-400 font-bold">Projected: {match.predictions?.projected_score} Runs</p>
                  </div>
                </div>

                {/* Batter Log */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-1.5">Batting Status</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-xs text-left">
                      <thead>
                        <tr className="text-slate-500 border-b border-slate-800/80 font-bold uppercase">
                          <th className="py-2">Batter</th>
                          <th className="py-2">Runs (Balls)</th>
                          <th className="py-2">4s / 6s</th>
                          <th className="py-2 text-right">SR</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/40 font-medium">
                        {match.scorecard?.innings_1.batting.slice(0, 3).map((bat, idx) => (
                          <tr key={idx} className="text-slate-300">
                            <td className="py-2.5 flex items-center gap-1.5">
                              <User size={12} className="text-slate-500" />
                              {bat.name} {bat.status === 'not out' && <span className="text-emerald-400">*</span>}
                            </td>
                            <td className="py-2.5 font-bold">{bat.runs} ({bat.balls})</td>
                            <td className="py-2.5 text-slate-400">{bat.fours} / {bat.sixes}</td>
                            <td className="py-2.5 text-right font-semibold text-slate-400">{bat.sr.toFixed(1)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Over log ticker */}
                <div className="p-3 rounded-xl bg-slate-950/20 border border-slate-800/50 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Recent Balls</span>
                  <div className="flex items-center gap-1.5">
                    {match.charts_data?.live_meta?.recent_balls.map((b, idx) => (
                      <span 
                        key={idx} 
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-extrabold border ${
                          b === 'W' 
                            ? 'bg-red-500/15 border-red-500/30 text-red-400' 
                            : b === '6' || b === '4'
                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                            : 'bg-slate-800 border-slate-700/60 text-slate-300'
                        }`}
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              // AI Prediction Tab
              <div className="p-6 rounded-2xl glass-panel border-white/5 space-y-6 shadow-glass">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Sparkles size={16} className="text-sky-400" />
                  Live AI Win Probability Forecast
                </h3>

                <div className="space-y-4">
                  {/* Probability Bar */}
                  <div className="relative h-6 bg-slate-800 rounded-full overflow-hidden flex font-bold text-[10px] text-white">
                    <div 
                      className="bg-sky-500 h-full flex items-center justify-center transition-all duration-500"
                      style={{ width: `${match.predictions?.win_probability?.India || 50}%` }}
                    >
                      India ({match.predictions?.win_probability?.India}%)
                    </div>
                    <div 
                      className="bg-pink-500 h-full flex items-center justify-center transition-all duration-500"
                      style={{ width: `${match.predictions?.win_probability?.Pakistan || 50}%` }}
                    >
                      Pakistan ({match.predictions?.win_probability?.Pakistan}%)
                    </div>
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase">
                    <span>Defending Champions</span>
                    <span>Chasing Unit</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/10 space-y-2">
                  <p className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <TrendingUp size={14} className="text-sky-400" />
                    AI Live Analytical Insights:
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                    {match.predictions?.ai_insights}
                  </p>
                  <div className="pt-2 text-[9px] text-slate-500 italic font-bold">
                    Disclaimer: Predictions are generated automatically by statistical machine learning models based on current over rates, historical stadium records, and matchup databases.
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Column 3: Live bowlers and quick metadata */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Bowler Details */}
            <div className="p-5 rounded-2xl glass-panel border-white/5 space-y-4 shadow-glass">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-1.5">Bowling unit</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead>
                    <tr className="text-slate-500 font-bold uppercase text-left border-b border-slate-800/80">
                      <th className="py-2">Bowler</th>
                      <th className="py-2">Overs</th>
                      <th className="py-2">Wkts</th>
                      <th className="py-2 text-right">Econ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40 font-medium text-slate-300">
                    {match.scorecard?.innings_1.bowling.slice(0, 3).map((bowl, idx) => (
                      <tr key={idx}>
                        <td className="py-2">{bowl.name}</td>
                        <td className="py-2">{bowl.overs}</td>
                        <td className="py-2 font-bold text-sky-400">{bowl.wickets}</td>
                        <td className="py-2 text-right text-slate-400">{bowl.economy.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Current Partnership details */}
            <div className="p-5 rounded-2xl glass-panel border-white/5 space-y-4 shadow-glass">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-1.5 flex items-center gap-1.5">
                <BarChart2 size={14} className="text-indigo-400" />
                Active Partnership
              </h3>
              {match.charts_data?.partnership.slice(0, 1).map((p, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-300">{p.players}</span>
                    <span className="text-sky-400">{p.runs} Runs</span>
                  </div>
                  <div className="relative h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="bg-sky-500 h-full w-2/3 rounded-full" />
                  </div>
                  <p className="text-[10px] text-slate-500 font-semibold">Faced {p.balls} balls together ({((p.runs / p.balls) * 100).toFixed(1)} SR)</p>
                </div>
              ))}
            </div>

          </div>

        </div>
      )}
      
    </div>
  );
};
export default LiveMatches;
