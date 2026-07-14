import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Send, Bot, User, ShieldAlert, Sparkles, Volume2, 
  VolumeX, Mic, MicOff, Share2, Download, BookOpen, AlertCircle, FileText 
} from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import api from '../services/api';
import { ChatMessage, SearchResult } from '../types';

export const AIChat: React.FC = () => {
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('q');
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [chatId, setChatId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [docOnlyMode, setDocOnlyMode] = useState(false);
  const [currentSources, setCurrentSources] = useState<SearchResult[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<{ time: number; confidence: number } | null>(null);

  const { isVoiceResponseEnabled, isPlaying, playSpeech, stopSpeech, startVoiceInput, isListening } = useAudio();
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Automatically submit if search param is present
  useEffect(() => {
    if (queryParam) {
      setInputText(queryParam);
      handleSendMessage(queryParam);
    }
  }, [queryParam]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    if (!textToSend) setInputText('');
    
    // Add user message
    const userMsg: ChatMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    setPerformanceMetrics(null);
    setCurrentSources([]);

    try {
      const response = await api.sendChatMessage(text, chatId, docOnlyMode, isVoiceResponseEnabled);
      
      setChatId(response.chat_id);
      
      // Simulate typing/streaming delay
      let fullAnswer = response.answer;
      setMessages(prev => [...prev, { role: 'assistant', content: fullAnswer }]);
      setCurrentSources(response.sources);
      setPerformanceMetrics({
        time: response.response_time_ms,
        confidence: response.confidence_score
      });

      // Play Audio voice response if received
      if (response.audio_content) {
        playSpeech(response.audio_content);
      }
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "⚠️ I encountered an error connecting to the RAG pipeline. Please make sure the FastAPI backend is running." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = () => {
    startVoiceInput((resultText) => {
      setInputText(resultText);
    });
  };

  const exportChatSession = () => {
    const chatText = messages.map(m => `[${m.role.toUpperCase()}]: ${m.content}`).join('\n\n');
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cricketiq-chat-${chatId || 'session'}.txt`;
    a.click();
  };

  const renderMessageContent = (content: string) => {
    // Simple custom markdown parser for rendering tables and bullet points nicely
    const lines = content.split('\n');
    let isTable = false;
    let tableHeaders: string[] = [];
    let tableRows: string[][] = [];

    return (
      <div className="space-y-2">
        {lines.map((line, idx) => {
          // Check for Table separator line
          if (line.startsWith('|') && line.includes('---')) {
            return null;
          }
          
          // Check for Table Row
          if (line.startsWith('|')) {
            isTable = true;
            const cells = line.split('|').map(c => c.trim()).filter(c => c);
            if (tableHeaders.length === 0) {
              tableHeaders = cells;
              return null;
            } else {
              tableRows.push(cells);
              return null;
            }
          }

          // If table parsing completed, render table
          if (isTable && !line.startsWith('|')) {
            isTable = false;
            const headers = [...tableHeaders];
            const rows = [...tableRows];
            tableHeaders = [];
            tableRows = [];
            return (
              <div key={`table-${idx}`} className="overflow-x-auto my-4">
                <table className="min-w-full divide-y divide-slate-800 border border-slate-800 rounded-lg overflow-hidden text-xs">
                  <thead className="bg-slate-900/80">
                    <tr>
                      {headers.map((h, hidx) => (
                        <th key={hidx} className="px-4 py-2 text-left font-bold text-slate-300">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-950/20">
                    {rows.map((row, ridx) => (
                      <tr key={ridx} className="hover:bg-slate-800/10">
                        {row.map((cell, cidx) => (
                          <td key={cidx} className="px-4 py-2 text-slate-400 font-medium">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }

          // Bullet points
          if (line.startsWith('- ') || line.startsWith('* ')) {
            return (
              <ul key={idx} className="list-disc pl-5 text-slate-300 text-sm leading-relaxed">
                <li>{line.substring(2)}</li>
              </ul>
            );
          }

          // Header levels
          if (line.startsWith('### ')) {
            return <h3 key={idx} className="text-base font-bold text-sky-400 pt-3">{line.substring(4)}</h3>;
          }
          if (line.startsWith('## ')) {
            return <h2 key={idx} className="text-lg font-bold text-white pt-4 border-b border-slate-800 pb-1">{line.substring(3)}</h2>;
          }

          // Regular paragraph
          return <p key={idx} className="text-slate-300 text-sm leading-relaxed">{line}</p>;
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto p-4 md:p-6 space-y-4">
      
      {/* Top Banner Control Panel */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass-panel border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-sky-500/15 text-sky-400">
            <Bot size={20} />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">CricketIQ RAG Chatbot</h1>
            <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
              <Sparkles size={10} className="text-sky-400" />
              LangChain Retrieval-Augmented Assistant
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Document Only Mode Toggle */}
          <button
            onClick={() => setDocOnlyMode(prev => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all ${
              docOnlyMode 
                ? 'bg-purple-500/15 border-purple-500/30 text-purple-400 shadow-sm' 
                : 'bg-slate-800 border-slate-700/60 text-slate-400 hover:bg-slate-700'
            }`}
          >
            <BookOpen size={12} />
            PDF Q&A Mode
          </button>

          {messages.length > 0 && (
            <button 
              onClick={exportChatSession}
              title="Export Conversation"
              className="p-2 rounded-xl border bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white transition-all"
            >
              <Download size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 overflow-y-auto rounded-2xl glass-panel border-white/5 p-4 md:p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto space-y-4">
            <span className="text-4xl">🤖</span>
            <h2 className="text-lg font-bold text-white font-display">Ask CricketIQ</h2>
            <p className="text-xs text-slate-400 leading-relaxed font-semibold">
              Query player head-to-heads, ICC averages, tactical statistics, or toggle PDF mode to query context from uploaded reports.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {["Compare Kohli and Babar", "Explain why India lost World Cup Final"].map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => { setInputText(q); handleSendMessage(q); }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/40 text-[11px] font-bold text-slate-300"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-sky-400 shrink-0">
                    <Bot size={16} />
                  </div>
                )}
                
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 border text-sm ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-sky-500/10 to-indigo-500/10 border-sky-500/25 text-white'
                    : 'bg-slate-900/30 border-white/5'
                }`}>
                  {msg.role === 'user' ? msg.content : renderMessageContent(msg.content)}
                </div>

                {msg.role === 'user' && (
                  <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-400 to-indigo-500 text-white font-bold text-xs shrink-0">
                    U
                  </div>
                )}
              </div>
            ))}
            
            {loading && (
              <div className="flex gap-4 justify-start">
                <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-sky-400 shrink-0">
                  <Bot size={16} />
                </div>
                <div className="bg-slate-900/30 border border-white/5 rounded-2xl px-4 py-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* RAG Retrieved Sources Block */}
      {currentSources.length > 0 && (
        <div className="p-4 rounded-2xl glass-panel border-white/5 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold border-b border-slate-800 pb-2">
            <span className="text-slate-300 flex items-center gap-1.5">
              <FileText size={14} className="text-sky-400" />
              Retrieved Sources & Context ({currentSources.length})
            </span>
            {performanceMetrics && (
              <span className="text-[10px] text-slate-500 font-semibold">
                Confidence: <span className="text-emerald-400">{(performanceMetrics.confidence * 100).toFixed(0)}%</span> | 
                Latency: <span className="text-indigo-400">{performanceMetrics.time}ms</span>
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-x-auto max-h-36">
            {currentSources.map((src, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/80 text-[11px] space-y-1.5">
                <div className="flex items-center justify-between font-bold text-slate-400">
                  <span className="truncate max-w-[150px]">{src.metadata.filename || src.metadata.source || "Knowledge Base"}</span>
                  <span className="text-[9px] text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded">Match: {(src.confidence * 100).toFixed(0)}%</span>
                </div>
                <p className="text-slate-500 leading-relaxed line-clamp-2 italic font-medium">
                  "{src.content}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Text Box */}
      <div className="flex items-center gap-3">
        {/* Voice Search Toggle */}
        <button
          onClick={handleVoiceInput}
          className={`p-3 rounded-2xl border transition-all ${
            isListening 
              ? 'bg-red-500/15 border-red-500/30 text-red-400 pulse-glow-effect' 
              : 'bg-slate-800 border-slate-700/60 text-slate-400 hover:text-white'
          }`}
        >
          {isListening ? <MicOff size={18} /> : <Mic size={18} />}
        </button>

        {/* Input Box */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={docOnlyMode ? "Query ONLY within uploaded PDF index..." : "Query CricketIQ statistics..."}
            className="w-full pl-4 pr-12 py-3 rounded-2xl glass-input text-xs text-white"
          />
          <button
            onClick={() => handleSendMessage()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white transition-all"
          >
            <Send size={14} />
          </button>
        </div>

        {/* TTS Audio Player Control Indicator */}
        {isPlaying && (
          <button
            onClick={stopSpeech}
            className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 transition-all"
            title="Stop Speech Playback"
          >
            <VolumeX size={18} />
          </button>
        )}
      </div>

    </div>
  );
};
export default AIChat;
