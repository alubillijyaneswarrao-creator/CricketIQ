import React, { useState } from 'react';
import { Search, Flame, FileText, CheckCircle2, ChevronRight } from 'lucide-react';
import api from '../services/api';
import { SearchResult } from '../types';

export const SemanticSearch: React.FC = () => {
  const [queryText, setQueryText] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryText.trim()) return;
    setLoading(true);
    try {
      const data = await api.semanticSearch(queryText);
      setSearchResults(data.results);
    } catch (err) {
      console.error(err);
      alert("Search failed. Verify that ChromaDB service is active.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 p-6 md:p-8 max-w-5xl mx-auto">
      
      {/* Page Header */}
      <div className="flex items-center gap-3 p-4 rounded-2xl glass-panel border-white/5 shadow-glass">
        <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400">
          <Search size={20} />
        </div>
        <div>
          <h1 className="text-sm font-bold text-white">Semantic Search Index</h1>
          <p className="text-[10px] text-slate-400 font-semibold">Perform dense vector similarity searches across cricket databases</p>
        </div>
      </div>

      {/* Main Search Panel */}
      <div className="p-6 rounded-2xl glass-panel border-white/5 space-y-6 shadow-glass">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder="Type naturally (e.g. 'IPL death finishers average strike rate')"
            className="w-full pl-12 pr-28 py-3.5 rounded-2xl glass-input text-xs text-white placeholder-slate-500"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <button 
            type="submit"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-semibold text-xs transition-all"
          >
            Vector Search
          </button>
        </form>

        {loading ? (
          <div className="flex justify-center items-center py-10 gap-2 text-xs font-bold text-slate-500 animate-pulse">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
            Computing embeddings & calculating cosine similarities...
          </div>
        ) : (
          searchResults.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Similarity Search Results</h3>
              <div className="space-y-4">
                {searchResults.map((res, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950/20 border border-slate-800/80 space-y-2 hover:border-slate-700/60 transition-all">
                    
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {res.category}
                        </span>
                        <span className="text-slate-500">
                          Source: {res.metadata.filename || res.metadata.source || "System KB"}
                        </span>
                      </div>
                      <span className="text-emerald-400">Match score: {(res.confidence * 100).toFixed(0)}%</span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                      "{res.content}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>

    </div>
  );
};
export default SemanticSearch;
