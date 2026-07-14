import React, { useState, useEffect } from 'react';
import { GitCompare, ShieldAlert, Sparkles, BookOpen, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import api from '../services/api';
import { Player } from '../types';
import { usePlayers } from '../hooks/useQueryHooks';
import { RadarComparisonChart } from '../components/Visualizations';

export const PlayerComparison: React.FC = () => {
  const { players } = usePlayers();
  
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [comparisonData, setComparisonData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (players.length >= 2 && !player1Name && !player2Name) {
      setPlayer1Name(players[0].name);
      setPlayer2Name(players[1].name);
      handleCompare(players[0].name, players[1].name);
    }
  }, [players]);

  const handleCompare = async (p1: string, p2: string) => {
    if (!p1 || !p2 || p1 === p2) return;
    setLoading(true);
    try {
      const data = await api.comparePlayers(p1, p2);
      setComparisonData(data);
    } catch (e) {
      console.error(e);
      alert("Error performing comparative match-up search.");
    } finally {
      setLoading(false);
    }
  };

  const handleP1Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setPlayer1Name(val);
    if (val && player2Name && val !== player2Name) {
      handleCompare(val, player2Name);
    }
  };

  const handleP2Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setPlayer2Name(val);
    if (player1Name && val && player1Name !== val) {
      handleCompare(player1Name, val);
    }
  };

  const parseBarChartData = () => {
    if (!comparisonData) return [];
    const p1 = comparisonData.player1 as Player;
    const p2 = comparisonData.player2 as Player;

    return [
      {
        name: 'Test Avg',
        [p1.name]: p1.stats.Test?.average || 0,
        [p2.name]: p2.stats.Test?.average || 0
      },
      {
        name: 'ODI Avg',
        [p1.name]: p1.stats.ODI?.average || 0,
        [p2.name]: p2.stats.ODI?.average || 0
      },
      {
        name: 'T20I Avg',
        [p1.name]: p1.stats.T20I?.average || 0,
        [p2.name]: p2.stats.T20I?.average || 0
      }
    ];
  };

  const parseCustomText = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('### ')) return <h3 key={i} className="text-sm font-bold text-sky-400 mt-3 mb-1.5">{line.substring(4)}</h3>;
      if (line.startsWith('- ')) return <li key={i} className="list-disc ml-4 mt-1 text-slate-300">{line.substring(2)}</li>;
      if (line.startsWith('|')) return null; // Hide raw tables
      return <p key={i} className="mt-1 leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className="space-y-8 p-6 md:p-8 max-w-7xl mx-auto">
      
      {/* Comparison Header Selectors */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass-panel border-white/5 shadow-glass">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-sky-500/15 text-sky-400">
            <GitCompare size={20} />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">Compare Player Statistics</h1>
            <p className="text-[10px] text-slate-400 font-semibold">Head-to-head metrics and automated AI comparisons</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <select 
            value={player1Name} 
            onChange={handleP1Change}
            className="px-3 py-1.5 rounded-xl border border-slate-700/60 bg-slate-900 text-xs text-slate-300 focus:outline-none focus:border-sky-500"
          >
            {players.map(p => (
              <option key={p.id} value={p.name} disabled={p.name === player2Name}>{p.name}</option>
            ))}
          </select>

          <span className="text-xs font-bold text-slate-500">VS</span>

          <select 
            value={player2Name} 
            onChange={handleP2Change}
            className="px-3 py-1.5 rounded-xl border border-slate-700/60 bg-slate-900 text-xs text-slate-300 focus:outline-none focus:border-sky-500"
          >
            {players.map(p => (
              <option key={p.id} value={p.name} disabled={p.name === player1Name}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <span className="text-4xl animate-spin">🏏</span>
          <p className="text-xs text-slate-400 font-bold">Assembling statistics, computing vectors and running RAG comparison...</p>
        </div>
      ) : (
        comparisonData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Column 1: Radar Chart & Comparative Aggregates */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Radar Chart Panel */}
              <div className="p-6 rounded-2xl glass-panel border-white/5 shadow-glass">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
                  Performance Radar Map
                </h3>
                <RadarComparisonChart 
                  data={comparisonData.charts}
                  player1Name={comparisonData.player1.name}
                  player2Name={comparisonData.player2.name}
                />
              </div>

              {/* Side-by-side general info cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/10 text-center">
                  <p className="text-xs font-bold text-white truncate">{comparisonData.player1.name}</p>
                  <p className="text-[10px] text-sky-400 mt-1">{comparisonData.player1.role}</p>
                  <div className="mt-4 space-y-1 text-[11px] font-semibold text-slate-300 text-left">
                    <p>ODI Rank: #{comparisonData.player1.icc_rankings.ODI || '-'}</p>
                    <p>Test Rank: #{comparisonData.player1.icc_rankings.Test || '-'}</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-pink-500/5 border border-pink-500/10 text-center">
                  <p className="text-xs font-bold text-white truncate">{comparisonData.player2.name}</p>
                  <p className="text-[10px] text-pink-400 mt-1">{comparisonData.player2.role}</p>
                  <div className="mt-4 space-y-1 text-[11px] font-semibold text-slate-300 text-left">
                    <p>ODI Rank: #{comparisonData.player2.icc_rankings.ODI || '-'}</p>
                    <p>Test Rank: #{comparisonData.player2.icc_rankings.Test || '-'}</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Columns 2-3: Double Bar Chart & AI Comparative Report */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Double Bar Chart comparing averages */}
              <section className="p-6 rounded-2xl glass-panel border-white/5 shadow-glass">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4 border-b border-slate-800/80 pb-2">
                  Format Average Comparison
                </h3>
                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={parseBarChartData()} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '10px' }}
                        labelStyle={{ color: '#94a3b8', fontSize: '10px' }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                      <Bar dataKey={comparisonData.player1.name} fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={20} />
                      <Bar dataKey={comparisonData.player2.name} fill="#ec4899" radius={[4, 4, 0, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>

              {/* RAG comparative AI report */}
              <section className="p-6 rounded-2xl glass-panel border-white/5 space-y-4 shadow-glass">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800/80 pb-2">
                  <Sparkles size={16} className="text-sky-400 animate-pulse" />
                  CricketIQ Comparative AI Summary
                </h3>
                <div className="text-xs text-slate-300 leading-relaxed font-semibold space-y-2">
                  {parseCustomText(comparisonData.ai_summary)}
                </div>
              </section>

            </div>

          </div>
        )
      )}
      
    </div>
  );
};
export default PlayerComparison;
