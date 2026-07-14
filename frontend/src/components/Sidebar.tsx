import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, MessageSquare, BarChart2, GitCompare, Radio, 
  Activity, Upload, Search, BookOpen, Star, Settings, 
  Volume2, VolumeX, Sun, Moon, Menu, X
} from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { useTheme } from '../context/ThemeContext';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { isVoiceResponseEnabled, toggleVoiceResponse } = useAudio();
  const { theme, toggleTheme } = useTheme();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'AI Chat', path: '/chat', icon: MessageSquare },
    { name: 'Player Analytics', path: '/players', icon: BarChart2 },
    { name: 'Compare Players', path: '/compare', icon: GitCompare },
    { name: 'Live Matches', path: '/live', icon: Radio },
    { name: 'Match Analytics', path: '/matches', icon: Activity },
    { name: 'Upload PDF', path: '/upload', icon: Upload },
    { name: 'Semantic Search', path: '/search', icon: Search },
    { name: 'Knowledge Base', path: '/knowledge', icon: BookOpen },
    { name: 'Saved Chats', path: '/saved', icon: Star },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 border-r border-[#1e293b]/60 bg-[#0f172a]/95 backdrop-blur-md transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-[#1e293b]/60">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏏</span>
            <span className="font-extrabold tracking-tight text-transparent bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text font-display">
              CricketIQ
            </span>
          </div>
          <button 
            className="p-1.5 rounded-lg text-slate-400 hover:text-white md:hidden hover:bg-slate-800"
            onClick={() => setIsOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive 
                      ? 'bg-gradient-to-r from-sky-500/10 to-indigo-500/10 border border-sky-500/20 text-sky-400' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`
                }
              >
                <Icon size={18} className="transition-transform group-hover:scale-110" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer controls: Audio, Dark Mode & Status */}
        <div className="p-4 border-t border-[#1e293b]/60 bg-slate-900/30">
          <div className="flex items-center justify-between px-2 mb-4">
            {/* Audio Toggle */}
            <button
              onClick={toggleVoiceResponse}
              title={isVoiceResponseEnabled ? "Disable TTS Readout" : "Enable TTS Readout"}
              className={`p-2 rounded-xl transition-all duration-200 border ${
                isVoiceResponseEnabled 
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20' 
                  : 'bg-slate-800/60 border-slate-700/40 text-slate-400 hover:bg-slate-800'
              }`}
            >
              {isVoiceResponseEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              className="p-2 rounded-xl border bg-slate-800/60 border-slate-700/40 text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>

          {/* User profile mock status */}
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-950/40 border border-slate-800/50">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-500 text-white font-bold text-xs">
              JD
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-950 rounded-full" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-slate-200 truncate">Senior Analyst</p>
              <p className="text-[10px] text-slate-500 truncate">demo@cricketiq.ai</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
export default Sidebar;
