import React, { useState, useEffect } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { PathView } from './components/PathView';
import { Playground } from './components/Playground';
import { Cheatsheet } from './components/Cheatsheet';
import { LeaderboardView } from './components/LeaderboardView';
import { ChatbotView } from './components/ChatbotView';
import { ProofGame } from './components/ProofGame';
import { ReviewView } from './components/ReviewView';
import { RepositoryView } from './components/RepositoryView';
import { AIQuizGenerator } from './components/AIQuizGenerator';
import { ProfileModal } from './components/ProfileModal';
import { DailyChallengeModal } from './components/DailyChallengeModal';

function MainContent() {
  const { activeView, checkDailyStreak } = useGame();
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isDailyOpen, setIsDailyOpen] = useState<boolean>(false);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState<boolean>(false);

  useEffect(() => {
    checkDailyStreak();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenDaily={() => setIsDailyOpen(true)}
        onOpenGenerator={() => setIsGeneratorOpen(true)}
      />

      <main className="flex-1 pb-16">
        {activeView === 'dashboard' && <Dashboard onOpenDaily={() => setIsDailyOpen(true)} />}
        {activeView === 'curriculum' && <PathView />}
        {activeView === 'playground' && <Playground />}
        {activeView === 'cheatsheet' && <Cheatsheet />}
        {activeView === 'leaderboard' && <LeaderboardView />}
        {activeView === 'chat' && <ChatbotView />}
        {activeView === 'game' && <ProofGame />}
        {activeView === 'review' && <ReviewView />}
        {activeView === 'repository' && <RepositoryView />}
      </main>

      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      <DailyChallengeModal isOpen={isDailyOpen} onClose={() => setIsDailyOpen(false)} />
      <AIQuizGenerator isOpen={isGeneratorOpen} onClose={() => setIsGeneratorOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <MainContent />
    </GameProvider>
  );
}
