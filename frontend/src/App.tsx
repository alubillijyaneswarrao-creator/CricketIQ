import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { AIChat } from './pages/AIChat';
import { PlayerAnalytics } from './pages/PlayerAnalytics';
import { PlayerComparison } from './pages/PlayerComparison';
import { LiveMatches } from './pages/LiveMatches';
import { MatchAnalytics } from './pages/MatchAnalytics';
import { UploadPDF } from './pages/UploadPDF';
import { SemanticSearch } from './pages/SemanticSearch';
import { KnowledgeBase } from './pages/KnowledgeBase';
import { SavedChats } from './pages/SavedChats';
import { Settings } from './pages/Settings';
import { AudioProvider } from './context/AudioContext';
import { ThemeProvider } from './context/ThemeContext';

export const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ThemeProvider>
      <AudioProvider>
        <Router>
          <div className="flex min-h-screen bg-[#0b0f19] text-[#e2e8f0]">
            
            {/* Sidebar navigation */}
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            {/* Main view container */}
            <div className="flex-1 flex flex-col md:pl-64 min-w-0">
              
              {/* Mobile Header Bar */}
              <header className="h-16 px-6 flex items-center justify-between border-b border-[#1e293b]/60 bg-[#0f172a]/60 backdrop-blur-md md:hidden sticky top-0 z-30">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🏏</span>
                  <span className="font-extrabold tracking-tight text-white font-display">CricketIQ</span>
                </div>
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <Menu size={22} />
                </button>
              </header>

              {/* Main Content Area */}
              <main className="flex-1 overflow-y-auto">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/chat" element={<AIChat />} />
                  <Route path="/players" element={<PlayerAnalytics />} />
                  <Route path="/compare" element={<PlayerComparison />} />
                  <Route path="/live" element={<LiveMatches />} />
                  <Route path="/matches" element={<MatchAnalytics />} />
                  <Route path="/upload" element={<UploadPDF />} />
                  <Route path="/search" element={<SemanticSearch />} />
                  <Route path="/knowledge" element={<KnowledgeBase />} />
                  <Route path="/saved" element={<SavedChats />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </main>

            </div>

          </div>
        </Router>
      </AudioProvider>
    </ThemeProvider>
  );
};
export default App;
