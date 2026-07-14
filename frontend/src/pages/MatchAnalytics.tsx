import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Activity, Sparkles, Trophy, Award, FileText, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import { Match } from '../types';
import { useMatches } from '../hooks/useQueryHooks';
import { WormGraph, PartnershipsChart, WinProbabilityChart } from '../components/Visualizations';

export const MatchAnalytics: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const idParam = searchParams.get('id');

  const { matches } = useMatches();
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (idParam) {
      const match = matches.find(m => m.id === parseInt(idParam));
      if (match) {
        setSelectedMatch(match);
        fetchInsights(match.id);
      }
    } else if (matches.length > 0 && !selectedMatch) {
      setSelectedMatch(matches[0]);
      fetchInsights(matches[0].id);
    }
  }, [idParam, matches]);

  const fetchInsights = async (id: number) => {
    setLoading(true);
    try {
      const data = await api.getMatchInsights(id);
      setInsights(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleMatchSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val) {
      setSearchParams({ id: val });
    }
  };

  return (
    <div className="space-y-8 p-6 md:p-8 max-w-7xl mx-auto">
      
      {/* Header Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass-panel border-white/5 shadow-glass">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400">
            <Activity size={20} />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">Post-Match Analytics</h1>
            <p className="text-[10px] text-slate-400 font-semibold">Technical worms, partnership charts, and tactical summaries</p>
          </div>
        </div>

        <select
          value={selectedMatch?.id || ''}
          onChange={handleMatchSelect}
          className="px-3 py-1.5 rounded-xl border border-slate-700/60 bg-slate-900 text-xs text-slate-300 focus:outline-none focus:border-sky-500"
        >
          {matches.map(m => (
            <option key={m.id} value={m.id}>{m.title}</option>
          ))}
        </select>
      </div>

      {selectedMatch && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Columns 1-2: Scorecard & Graphs */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Worm Graph & Win Prob */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="p-5 rounded-2xl glass-panel border-white/5 shadow-glass">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
                  Match Run-Rate Worm Graph
                </h3>
                {selectedMatch.charts_data && <WormGraph data={selectedMatch.charts_data.worm_graph} />}
              </div>

              <div className="p-5 rounded-2xl glass-panel border-white/5 shadow-glass">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
                  Win Probability Timeline (%)
                </h3>
                {selectedMatch.momentum_data && <WinProbabilityChart data={selectedMatch.momentum_data} />}
              </div>

            </div>

            {/* Scorecard Table View */}
            <div className="p-6 rounded-2xl glass-panel border-white/5 space-y-6 shadow-glass">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Trophy size={16} className="text-amber-500" />
                Detailed Match Scorecard
              </h3>

              {/* Innings 1 Batting */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/80">
                  <span>{selectedMatch.scorecard?.innings_1.team} Innings</span>
                  <span className="text-white">{selectedMatch.scorecard?.innings_1.score}/{selectedMatch.scorecard?.innings_1.wickets} ({selectedMatch.scorecard?.innings_1.overs} Ov)</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs text-left">
                    <thead>
                      <tr className="text-slate-500 font-bold uppercase border-b border-slate-800">
                        <th className="py-2">Batter</th>
                        <th className="py-2">Dismissal</th>
                        <th className="py-2">Runs (Balls)</th>
                        <th className="py-2 text-right">SR</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40 text-slate-300 font-medium">
                      {selectedMatch.scorecard?.innings_1.batting.map((bat, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/10">
                          <td className="py-2">{bat.name}</td>
                          <td className="py-2 text-slate-500 italic">{bat.status}</td>
                          <td className="py-2 font-bold">{bat.runs} ({bat.balls})</td>
                          <td className="py-2 text-right text-slate-400">{bat.sr.toFixed(1)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Innings 2 Batting */}
              <div className="space-y-3 pt-4 border-t border-slate-800/60">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/80">
                  <span>{selectedMatch.scorecard?.innings_2.team} Innings</span>
                  <span className="text-white">{selectedMatch.scorecard?.innings_2.score}/{selectedMatch.scorecard?.innings_2.wickets} ({selectedMatch.scorecard?.innings_2.overs} Ov)</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs text-left">
                    <thead>
                      <tr className="text-slate-500 font-bold uppercase border-b border-slate-800">
                        <th className="py-2">Batter</th>
                        <th className="py-2">Dismissal</th>
                        <th className="py-2">Runs (Balls)</th>
                        <th className="py-2 text-right">SR</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40 text-slate-300 font-medium">
                      {selectedMatch.scorecard?.innings_2.batting.map((bat, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/10">
                          <td className="py-2">{bat.name}</td>
                          <td className="py-2 text-slate-500 italic">{bat.status}</td>
                          <td className="py-2 font-bold">{bat.runs} ({bat.balls})</td>
                          <td className="py-2 text-right text-slate-400">{bat.sr.toFixed(1)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

          </div>

          {/* Column 3: AI Insights, Partnerships & Turning Points */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* AI Summary report */}
            <div className="p-5 rounded-2xl glass-panel border-white/5 space-y-4 shadow-glass">
              <h3 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider border-b border-slate-800 pb-2">
                <Sparkles size={14} className="text-sky-400 animate-pulse" />
                AI Match Commentary
              </h3>
              {loading ? (
                <div className="text-slate-500 text-[10px] font-bold">Computing insights...</div>
              ) : (
                insights && (
                  <p className="text-[11px] text-slate-300 leading-relaxed font-semibold">
                    {insights.ai_summary}
                  </p>
                )
              )}
            </div>

            {/* Partnership Visuals */}
            <div className="p-5 rounded-2xl glass-panel border-white/5 shadow-glass">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
                Top Partnerships
              </h3>
              {selectedMatch.charts_data && <PartnershipsChart data={selectedMatch.charts_data.partnership} />}
            </div>

            {/* Turning Points List */}
            <div className="p-5 rounded-2xl glass-panel border-white/5 space-y-4 shadow-glass">
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wider border-b border-slate-800 pb-2">
                <CheckCircle2 size={14} className="text-emerald-400" />
                Turning Points
              </h3>
              <div className="space-y-3">
                {selectedMatch.turning_points?.map((pt, idx) => (
                  <div key={idx} className="flex gap-2.5 text-[10px] font-semibold text-slate-300 leading-relaxed">
                    <span className="text-indigo-400 font-extrabold">{idx+1}.</span>
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}
      
    </div>
  );
};
export default MatchAnalytics;
