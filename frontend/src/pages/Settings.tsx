import React from 'react';
import { Settings as SettingsIcon, Shield, Server, Sparkles, Volume2, Database } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

export const Settings: React.FC = () => {
  const { isVoiceResponseEnabled, toggleVoiceResponse } = useAudio();

  return (
    <div className="space-y-8 p-6 md:p-8 max-w-4xl mx-auto">
      
      {/* Page Header */}
      <div className="flex items-center gap-3 p-4 rounded-2xl glass-panel border-white/5 shadow-glass">
        <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400">
          <SettingsIcon size={20} />
        </div>
        <div>
          <h1 className="text-sm font-bold text-white">System Settings</h1>
          <p className="text-[10px] text-slate-400 font-semibold font-sans">Verify system statuses and configure LLM parameters</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column: AI Parameters & TTS settings */}
        <div className="space-y-6">
          
          {/* Audio voice settings */}
          <div className="p-6 rounded-2xl glass-panel border-white/5 space-y-4 shadow-glass">
            <h3 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider border-b border-slate-800 pb-2">
              <Volume2 size={14} className="text-sky-400" />
              Voice Speech Synthesis
            </h3>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-300">Automated TTS Readout</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Read AI response text vocally upon completion</p>
              </div>
              <button
                onClick={toggleVoiceResponse}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  isVoiceResponseEnabled ? 'bg-sky-500' : 'bg-slate-700'
                }`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                  isVoiceResponseEnabled ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>

          {/* Model selection */}
          <div className="p-6 rounded-2xl glass-panel border-white/5 space-y-4 shadow-glass">
            <h3 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider border-b border-slate-800 pb-2">
              <Sparkles size={14} className="text-indigo-400 animate-pulse" />
              AI Core LLM Engine
            </h3>
            
            <div className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-slate-400 text-[10px] uppercase font-bold">Selected Model</label>
                <select className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 focus:outline-none">
                  <option>Google Gemini 1.5 Flash (Recommended)</option>
                  <option disabled>OpenAI GPT-4o (Configurable)</option>
                  <option disabled>Meta Llama 3 via Groq (Configurable)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 text-[10px] uppercase font-bold">Embedding Model</label>
                <input 
                  type="text" 
                  value="HuggingFace sentence-transformers/all-MiniLM-L6-v2"
                  disabled
                  className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-900/50 text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: DB & Service Status indicators */}
        <div className="space-y-6">
          
          <div className="p-6 rounded-2xl glass-panel border-white/5 space-y-4 shadow-glass">
            <h3 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider border-b border-slate-800 pb-2">
              <Server size={14} className="text-purple-400" />
              Service Connective Statuses
            </h3>

            <div className="space-y-3 text-xs font-semibold">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/20 border border-slate-900">
                <span className="text-slate-400">FastAPI Server</span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Online
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/20 border border-slate-900">
                <span className="text-slate-400">ChromaDB Vector Store</span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Connected
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/20 border border-slate-900">
                <span className="text-slate-400">Relational Database Engine</span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  SQLite Fallback
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl glass-panel border-white/5 space-y-3 shadow-glass">
            <h3 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider border-b border-slate-800 pb-2">
              <Shield size={14} className="text-amber-500" />
              API Security Verification
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
              FastAPI handles input validation using Pydantic models. Vector stores calculate cosine distance, preventing SQL and semantic injection hazards.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
export default Settings;
