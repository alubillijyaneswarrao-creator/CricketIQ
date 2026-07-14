import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Flame, TrendingUp, Sparkles, Trophy, BookOpen, Clock, PlayCircle } from 'lucide-react';
import { usePlayers, useMatches } from '../hooks/useQueryHooks';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { players } = usePlayers();
  const { matches } = useMatches();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/chat?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handlePopularQuestion = (q: string) => {
    navigate(`/chat?q=${encodeURIComponent(q)}`);
  };

  const popularQuestions = [
    "Compare Virat Kohli and Joe Root stats.",
    "Explain why India lost the World Cup Final.",
    "Who is statistically the best death bowler?",
    "Give me fantasy captain picks based on statistics."
  ];

  const newsItems = [
    { id: 1, title: "Bumrah's spell in T20 World Cup declared 'greatest of all time'", source: "ESPN Cricinfo", time: "2 hrs ago" },
    { id: 2, title: "Kohli breaks Sachin's long-standing ODI century record in epic semi-final", source: "Cricbuzz", time: "5 hrs ago" },
    { id: 3, title: "IPL mega auction scheduled for London: Top players registered", source: "ICC Media", time: "1 day ago" }
  ];

  return (
    <div className="space-y-8 p-6 md:p-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative p-8 rounded-3xl overflow-hidden glass-panel border-white/5 bg-gradient-to-br from-slate-900 via-indigo-950/20 to-slate-900 shadow-glass">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-400 text-xs font-semibold">
            <Sparkles size={12} />
            Cricket Analytics Engine v1.0
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight font-display">
            Cricket Intelligence <br />
            Powered by <span className="text-transparent bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text">Advanced RAG</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base">
            Explore advanced statistics, live match forecasts, AI-driven player profiling, and semantic query matches based on extensive cricketing archives.
          </p>

          {/* AI Search Bar */}
          <form onSubmit={handleSearchSubmit} className="pt-4 max-w-lg">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask anything (e.g. 'Compare Kohli and Joe Root')"
                className="w-full pl-12 pr-28 py-3.5 rounded-2xl glass-input text-sm text-white placeholder-slate-500 shadow-glass-sm"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <button 
                type="submit"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-semibold text-xs transition-all shadow-md"
              >
                Analyze
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Match Ticker & Featured Widgets */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Today's Matches */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
              <Trophy size={18} className="text-amber-500" />
              Featured Matches
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matches.slice(0, 2).map((match) => (
                <div 
                  key={match.id}
                  onClick={() => navigate(`/matches?id=${match.id}`)}
                  className="p-5 rounded-2xl glass-panel glass-panel-hover cursor-pointer flex flex-col justify-between h-44 shadow-glass-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">{match.format} • {match.venue?.split(',')[1] || match.venue}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      match.status === 'live' 
                        ? 'bg-red-500/15 text-red-400 border border-red-500/20 pulse-glow-effect' 
                        : 'bg-slate-800 text-slate-400 border border-slate-700/50'
                    }`}>
                      {match.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-3 my-2">
                    <div className="flex items-center justify-between text-sm font-semibold">
                      <span className="text-slate-300">{match.team_a}</span>
                      <span className="text-slate-100">{match.scorecard?.innings_1.score}/{match.scorecard?.innings_1.wickets}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm font-semibold">
                      <span className="text-slate-300">{match.team_b}</span>
                      <span className="text-slate-100">
                        {match.status === 'live' ? 'Batting' : `${match.scorecard?.innings_2.score}/${match.scorecard?.innings_2.wickets}`}
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 border-t border-slate-800/60 pt-2 truncate font-medium">
                    {match.status === 'live' ? `AI Prediction: ${match.predictions?.projected_score} projected score` : match.summary}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Popular Questions */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
              <Flame size={18} className="text-orange-500" />
              Popular AI Insights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {popularQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePopularQuestion(q)}
                  className="flex items-center justify-between p-3.5 rounded-xl glass-panel hover:bg-slate-800/40 border-white/5 text-left text-xs font-semibold text-slate-300 hover:text-white transition-all group"
                >
                  <span>{q}</span>
                  <PlayCircle size={14} className="text-slate-500 group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>
          </section>

        </div>

        {/* Right 1 Column: Trending Players & Latest News */}
        <div className="space-y-8">
          
          {/* Trending Players */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
              <TrendingUp size={18} className="text-sky-400" />
              Trending Players
            </h2>
            <div className="space-y-3">
              {players.slice(0, 3).map((player) => (
                <div 
                  key={player.id}
                  onClick={() => navigate(`/players?name=${encodeURIComponent(player.name)}`)}
                  className="flex items-center justify-between p-3 rounded-xl glass-panel glass-panel-hover cursor-pointer shadow-glass-sm"
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={player.image_url} 
                      alt={player.name}
                      className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 object-cover" 
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-200">{player.name}</p>
                      <p className="text-[10px] text-slate-400">{player.role} • {player.country}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 font-medium">ICC Rank</p>
                    <p className="text-xs font-bold text-sky-400">#{player.icc_rankings.ODI || player.icc_rankings.Test || 'N/A'}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Latest News */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
              <BookOpen size={18} className="text-indigo-400" />
              Latest News
            </h2>
            <div className="space-y-3">
              {newsItems.map((news) => (
                <div key={news.id} className="p-3.5 rounded-xl glass-panel border-white/5 space-y-1.5">
                  <p className="text-xs font-bold text-slate-300 leading-relaxed hover:text-sky-400 cursor-pointer transition-colors">
                    {news.title}
                  </p>
                  <div className="flex items-center justify-between text-[9px] text-slate-500 font-semibold">
                    <span>{news.source}</span>
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {news.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

      </div>
    </div>
  );
};
export default Dashboard;
