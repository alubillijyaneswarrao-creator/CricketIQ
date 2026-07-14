import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Trash2, MessageSquare, Clock, ChevronRight } from 'lucide-react';
import { useChatHistory } from '../hooks/useQueryHooks';
import api from '../services/api';

export const SavedChats: React.FC = () => {
  const navigate = useNavigate();
  const { history, loading, refreshHistory } = useChatHistory();

  const handleToggleBookmark = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await api.toggleBookmark(id);
      refreshHistory();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteChat = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this chat history?")) return;
    try {
      await api.deleteChat(id);
      refreshHistory();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 p-6 md:p-8 max-w-5xl mx-auto">
      
      {/* Page Header */}
      <div className="flex items-center gap-3 p-4 rounded-2xl glass-panel border-white/5 shadow-glass">
        <div className="p-2 rounded-xl bg-sky-500/15 text-sky-400">
          <Star size={20} />
        </div>
        <div>
          <h1 className="text-sm font-bold text-white">Saved Conversations</h1>
          <p className="text-[10px] text-slate-400 font-semibold font-sans">Access past RAG queries, bookmarked analytics reports, and chat logs</p>
        </div>
      </div>

      {loading ? (
        <div className="text-xs text-slate-500 font-bold text-center py-20 animate-pulse">Loading saved chats...</div>
      ) : history.length === 0 ? (
        <div className="text-center py-20 space-y-3">
          <span className="text-4xl">⭐</span>
          <p className="text-xs text-slate-400 font-bold">No saved conversations yet. Ask questions in the AI Chat to log history.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((chat) => (
            <div
              key={chat.id}
              onClick={() => navigate(`/chat?chat_id=${chat.id}`)}
              className="p-4 rounded-2xl glass-panel glass-panel-hover flex items-center justify-between cursor-pointer border-white/5 shadow-glass-sm"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700/60 text-sky-400 shrink-0">
                  <MessageSquare size={16} />
                </div>
                <div className="min-w-0 space-y-1">
                  <h3 className="text-xs font-bold text-slate-200 truncate">{chat.title}</h3>
                  <p className="text-[9px] text-slate-500 font-bold flex items-center gap-1">
                    <Clock size={10} />
                    {new Date(chat.created_at).toLocaleDateString()} • {chat.messages.length} messages
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Bookmark Button */}
                <button
                  onClick={(e) => handleToggleBookmark(e, chat.id)}
                  className={`p-2 rounded-xl border transition-all ${
                    chat.is_bookmarked
                      ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                      : 'bg-slate-800 border-slate-700/40 text-slate-500 hover:text-slate-200'
                  }`}
                  title="Bookmark Chat"
                >
                  <Star size={14} fill={chat.is_bookmarked ? "currentColor" : "none"} />
                </button>

                {/* Delete Button */}
                <button
                  onClick={(e) => handleDeleteChat(e, chat.id)}
                  className="p-2 rounded-xl border bg-slate-800/60 border-slate-700/40 text-slate-500 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all"
                  title="Delete Chat"
                >
                  <Trash2 size={14} />
                </button>

                <ChevronRight size={16} className="text-slate-600 pl-1" />
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
export default SavedChats;
