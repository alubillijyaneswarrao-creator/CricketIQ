import React, { useState } from 'react';
import { BookOpen, Trophy, Award, BookOpen as BookIcon, ChevronRight } from 'lucide-react';
import { usePlayers } from '../hooks/useQueryHooks';

export const KnowledgeBase: React.FC = () => {
  const { players } = usePlayers();
  const [activeTab, setActiveTab] = useState<'players' | 'rankings' | 'rules'>('players');

  const rulesData = [
    { title: "Innings & Overs", desc: "A match is divided into innings during which one team bats and the other bowls. Overs consist of 6 legal deliveries." },
    { title: "Decision Review System (DRS)", desc: "Teams have limited reviews per innings to challenge umpire decisions using Hawk-Eye ball tracking, UltraEdge/Snickometer, and Hotspot." },
    { title: "Powerplay Rules", desc: "Powerplays restrict the number of fielders permitted outside the 30-yard circle to encourage scoring: 10 overs in ODIs, 6 overs in T25s." }
  ];

  return (
    <div className="space-y-8 p-6 md:p-8 max-w-6xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass-panel border-white/5 shadow-glass">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-sky-500/15 text-sky-400">
            <BookOpen size={20} />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">Cricket Knowledge Base</h1>
            <p className="text-[10px] text-slate-400 font-semibold">Reference guides, tournament stats, and rule logs</p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 border-l border-slate-800 pl-4">
          <button
            onClick={() => setActiveTab('players')}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
              activeTab === 'players' 
                ? 'bg-sky-500/15 text-sky-400 border border-sky-500/20' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Players
          </button>
          <button
            onClick={() => setActiveTab('rankings')}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
              activeTab === 'rankings' 
                ? 'bg-sky-500/15 text-sky-400 border border-sky-500/20' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ICC Rankings
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
              activeTab === 'rules' 
                ? 'bg-sky-500/15 text-sky-400 border border-sky-500/20' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Rules & Laws
          </button>
        </div>
      </div>

      {activeTab === 'players' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {players.map((p) => (
            <div key={p.id} className="p-5 rounded-2xl glass-panel border-white/5 flex gap-4 items-start shadow-glass-sm">
              <img 
                src={p.image_url} 
                alt={p.name}
                className="w-16 h-16 rounded-xl bg-slate-800 border border-slate-700 object-cover" 
              />
              <div className="space-y-1 overflow-hidden">
                <h3 className="text-sm font-bold text-white truncate">{p.name}</h3>
                <p className="text-[10px] text-sky-400 font-bold uppercase tracking-wider">{p.role} • {p.country}</p>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mt-1 font-medium">{p.bio}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'rankings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Batting Rankings */}
          <div className="p-6 rounded-2xl glass-panel border-white/5 space-y-4 shadow-glass">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <Award size={14} className="text-amber-500" />
              ICC ODI Batting Rankings
            </h3>
            <div className="space-y-2">
              {[
                { rank: 1, name: "Babar Azam", country: "Pakistan", points: 824 },
                { rank: 2, name: "Shubman Gill", country: "India", points: 801 },
                { rank: 3, name: "Virat Kohli", country: "India", points: 768 },
                { rank: 4, name: "Rohit Sharma", country: "India", points: 746 }
              ].map((item) => (
                <div key={item.rank} className="flex items-center justify-between text-xs font-semibold p-2 rounded-lg hover:bg-slate-800/10">
                  <div className="flex items-center gap-3">
                    <span className="text-indigo-400 font-extrabold w-4">#{item.rank}</span>
                    <span className="text-slate-300">{item.name} ({item.country})</span>
                  </div>
                  <span className="text-slate-500">{item.points} pts</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bowling Rankings */}
          <div className="p-6 rounded-2xl glass-panel border-white/5 space-y-4 shadow-glass">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <Award size={14} className="text-indigo-400" />
              ICC Test Bowling Rankings
            </h3>
            <div className="space-y-2">
              {[
                { rank: 1, name: "Jasprit Bumrah", country: "India", points: 897 },
                { rank: 2, name: "Ravichandran Ashwin", country: "India", points: 870 },
                { rank: 3, name: "Kagiso Rabada", country: "South Africa", points: 825 },
                { rank: 4, name: "Pat Cummins", country: "Australia", points: 811 }
              ].map((item) => (
                <div key={item.rank} className="flex items-center justify-between text-xs font-semibold p-2 rounded-lg hover:bg-slate-800/10">
                  <div className="flex items-center gap-3">
                    <span className="text-indigo-400 font-extrabold w-4">#{item.rank}</span>
                    <span className="text-slate-300">{item.name} ({item.country})</span>
                  </div>
                  <span className="text-slate-500">{item.points} pts</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {activeTab === 'rules' && (
        <div className="space-y-4">
          {rulesData.map((rule, idx) => (
            <div key={idx} className="p-5 rounded-2xl glass-panel border-white/5 space-y-2 shadow-glass-sm">
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <BookIcon size={14} className="text-sky-400" />
                {rule.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold">{rule.desc}</p>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
export default KnowledgeBase;
