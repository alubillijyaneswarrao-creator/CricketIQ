import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Shield, Award, Calendar, Star, BarChart, User2 } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import api from '../services/api';
import { Player } from '../types';
import { usePlayers } from '../hooks/useQueryHooks';

export const PlayerAnalytics: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const nameParam = searchParams.get('name');
  
  const { players } = usePlayers();
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (nameParam) {
      handleSearchPlayer(nameParam);
    } else if (players.length > 0 && !selectedPlayer) {
      setSelectedPlayer(players[0]);
    }
  }, [nameParam, players]);

  const handleSearchPlayer = async (name: string) => {
    setLoading(true);
    try {
      const data = await api.getPlayerByName(name);
      setSelectedPlayer(data);
    } catch (e) {
      console.error(e);
      alert(`Could not find player "${name}". Please choose one from the list.`);
    } finally {
      setLoading(false);
    }
  };

  const handleDropdownSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val) {
      setSearchParams({ name: val });
    }
  };

  const statsFormats = ["Test", "ODI", "T20I"];

  return (
    <div className="space-y-8 p-6 md:p-8 max-w-7xl mx-auto">
      
      {/* Search Header Panel */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass-panel border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400">
            <BarChart size={20} />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">Player Analytics Hub</h1>
            <p className="text-[10px] text-slate-400 font-semibold">Visualizing career trajectories and AI summaries</p>
          </div>
        </div>

        {/* Dropdown Select + Autocomplete */}
        <div className="flex items-center gap-2">
          <select 
            onChange={handleDropdownSelect}
            value={selectedPlayer?.name || ''}
            className="px-3 py-1.5 rounded-xl border border-slate-700/60 bg-slate-900 text-xs text-slate-300 focus:outline-none focus:border-sky-500"
          >
            <option value="">Select a Player...</option>
            {players.map(p => (
              <option key={p.id} value={p.name}>{p.name} ({p.country})</option>
            ))}
          </select>
        </div>
      </div>

      {selectedPlayer && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1: Player Card & AI Assessment */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Biography Profile Card */}
            <div className="p-6 rounded-2xl glass-panel border-white/5 text-center relative overflow-hidden shadow-glass">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-2xl" />
              
              <img 
                src={selectedPlayer.image_url || "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=200"}
                alt={selectedPlayer.name}
                className="w-24 h-24 rounded-full mx-auto border-2 border-sky-500/20 object-cover shadow-glass-sm"
              />
              
              <h2 className="text-lg font-bold text-white mt-4">{selectedPlayer.name}</h2>
              <p className="text-xs text-sky-400 font-bold uppercase tracking-wider">{selectedPlayer.role} • {selectedPlayer.country}</p>
              
              <div className="grid grid-cols-2 gap-4 mt-6 border-t border-slate-800/80 pt-4 text-xs font-semibold">
                <div className="text-left bg-slate-950/20 p-2.5 rounded-xl border border-slate-800/50">
                  <p className="text-slate-500 text-[10px] uppercase font-bold">Batting Style</p>
                  <p className="text-slate-300 mt-0.5">{selectedPlayer.batting_style || "N/A"}</p>
                </div>
                <div className="text-left bg-slate-950/20 p-2.5 rounded-xl border border-slate-800/50">
                  <p className="text-slate-500 text-[10px] uppercase font-bold">Bowling Style</p>
                  <p className="text-slate-300 mt-0.5">{selectedPlayer.bowling_style || "N/A"}</p>
                </div>
              </div>
              
              <p className="text-xs text-slate-400 text-left mt-6 leading-relaxed border-t border-slate-800/80 pt-4 italic font-medium">
                {selectedPlayer.bio}
              </p>
            </div>

            {/* AI Insights & Assessment */}
            <div className="p-6 rounded-2xl glass-panel border-white/5 space-y-4 shadow-glass">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Shield size={16} className="text-sky-400" />
                CricketIQ AI Assessment
              </h3>
              <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/10 text-xs text-slate-300 leading-relaxed font-semibold">
                {selectedPlayer.ai_summary}
              </div>
            </div>

          </div>

          {/* Columns 2-3: Performance statistics, Charts, Timeline */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* ICC Rankings & Formats Stats */}
            <section className="space-y-4">
              <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                <Award size={18} className="text-amber-500" />
                Format Statistics & ICC Rankings
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {statsFormats.map((fmt) => {
                  const s = selectedPlayer.stats[fmt] || { matches: 0, runs: 0, average: 0, strike_rate: 0, hundreds: 0, wickets: 0 };
                  const rank = selectedPlayer.icc_rankings[fmt] || 0;
                  return (
                    <div key={fmt} className="p-5 rounded-2xl glass-panel border-white/5 space-y-4 relative shadow-glass-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white">{fmt}</span>
                        <span className="text-[10px] font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full">
                          {rank > 0 ? `ICC Rank: #${rank}` : 'Unranked'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs">
                        <div>
                          <p className="text-slate-500 text-[10px] uppercase font-bold">Matches</p>
                          <p className="text-slate-200 font-bold">{s.matches}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-[10px] uppercase font-bold">{s.runs !== undefined ? 'Runs' : 'Wickets'}</p>
                          <p className="text-slate-200 font-bold">{s.runs !== undefined ? s.runs : s.wickets}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-[10px] uppercase font-bold">Average</p>
                          <p className="text-slate-200 font-bold">{s.average.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-[10px] uppercase font-bold">{s.strike_rate !== undefined ? 'Strike Rate' : 'Economy'}</p>
                          <p className="text-slate-200 font-bold">{s.strike_rate !== undefined ? s.strike_rate : s.economy}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Recent Form Chart */}
            <section className="p-6 rounded-2xl glass-panel border-white/5 space-y-4 shadow-glass">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Star size={16} className="text-sky-400" />
                Recent Match Form Log
              </h3>
              
              <div className="w-full h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={selectedPlayer.recent_form} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="opponent" stroke="#64748b" fontSize={10} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '10px' }}
                      labelStyle={{ color: '#94a3b8', fontSize: '10px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey={selectedPlayer.role === 'Bowler' ? 'wickets' : 'runs'} 
                      name={selectedPlayer.role === 'Bowler' ? 'Wickets' : 'Runs Scored'} 
                      stroke="#818cf8" 
                      fillOpacity={0.1} 
                      fill="url(#colorForm)" 
                    />
                    <defs>
                      <linearGradient id="colorForm" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* Interactive Timeline */}
            <section className="space-y-4">
              <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                <Calendar size={18} className="text-indigo-400" />
                Career Milestones & Timeline
              </h3>
              
              <div className="relative border-l border-slate-800 ml-4 pl-6 space-y-6 text-xs font-semibold">
                {selectedPlayer.timeline.map((event, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-slate-900 border-2 border-indigo-400 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                    </span>
                    <span className="text-indigo-400 font-extrabold text-[11px] uppercase tracking-wider">{event.year}</span>
                    <p className="text-slate-300 mt-1 font-medium leading-relaxed">{event.event}</p>
                  </div>
                ))}
              </div>
            </section>

          </div>

        </div>
      )}
      
    </div>
  );
};
export default PlayerAnalytics;
