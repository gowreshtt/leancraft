import React from 'react';
import { useGame } from '../context/GameContext';
import { BookOpen, Code2, Trophy, BookMarked, Home, Flame, Award, Settings, User, Bot, Gamepad2, Brain, FolderArchive, Sparkles } from 'lucide-react';
import { CURRICULUM_MODULES } from '../data/curriculum';

interface NavbarProps {
  onOpenProfile: () => void;
  onOpenDaily: () => void;
  onOpenGenerator: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenProfile, onOpenDaily, onOpenGenerator }) => {
  const { profile, activeView, setActiveView } = useGame();

  const allExercises = CURRICULUM_MODULES.flatMap(m => m.lessons.flatMap(l => l.exercises));
  const today = new Date().toISOString().split('T')[0];
  const dueCount = allExercises.filter(ex => {
    if (!profile.completedExercises?.includes(ex.id)) return false;
    const srs = profile.srsItems?.[ex.id];
    if (!srs) return true;
    return srs.dueDate <= today;
  }).length;

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveView('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-500/20">
              ⊢
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-indigo-400 to-violet-300 bg-clip-text text-transparent">
                LeanCraft
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs px-2 py-0.5 rounded-full bg-slate-800 text-indigo-400 border border-slate-700">
                Lean 4 Academy
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveView('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeView === 'dashboard'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Home className="w-4 h-4" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveView('curriculum')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeView === 'curriculum'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Path
            </button>
            <button
              onClick={() => setActiveView('playground')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeView === 'playground'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Code2 className="w-4 h-4" />
              Sandbox
            </button>
            <button
              onClick={() => setActiveView('repository')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeView === 'repository'
                  ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <FolderArchive className="w-4 h-4" />
              Repository
            </button>
            <button
              onClick={() => setActiveView('chat')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeView === 'chat'
                  ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Bot className="w-4 h-4" />
              AI Tutor
            </button>
            <button
              onClick={() => setActiveView('review')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                activeView === 'review'
                  ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Brain className="w-4 h-4" />
              Review
              {dueCount > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                  {dueCount}
                </span>
              )}
            </button>
          </nav>

          {/* User Stats & Profile Trigger */}
          <div className="flex items-center gap-3">
            {/* AI Generator Button */}
            <button
              onClick={onOpenGenerator}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600/20 border border-violet-500/30 text-violet-300 text-xs font-semibold hover:bg-violet-600/30 transition-colors"
              title="Generate AI Question"
            >
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="hidden sm:inline">AI Practice</span>
            </button>

            {/* Daily Challenge Button */}
            <button
              onClick={onOpenDaily}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold hover:bg-amber-500/20 transition-colors"
              title="Daily Challenge"
            >
              <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
              <span className="hidden sm:inline">Streak:</span> {profile.streak}d
            </button>

            {/* XP & Level Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Award className="w-4 h-4 text-indigo-400" />
              <span>Lvl {profile.level}</span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-300">{profile.xp} XP</span>
            </div>

            {/* Profile Button */}
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors"
              title="Profile & Settings"
            >
              <span className="text-lg">{profile.avatar}</span>
              <span className="hidden md:inline text-xs font-medium max-w-[90px] truncate">{profile.username}</span>
              <Settings className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800 bg-slate-950 py-2 px-1">
        <button
          onClick={() => setActiveView('dashboard')}
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium ${
            activeView === 'dashboard' ? 'text-indigo-400' : 'text-slate-400'
          }`}
        >
          <Home className="w-4 h-4" />
          Home
        </button>
        <button
          onClick={() => setActiveView('curriculum')}
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium ${
            activeView === 'curriculum' ? 'text-indigo-400' : 'text-slate-400'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Learn
        </button>
        <button
          onClick={() => setActiveView('playground')}
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium ${
            activeView === 'playground' ? 'text-indigo-400' : 'text-slate-400'
          }`}
        >
          <Code2 className="w-4 h-4" />
          Sandbox
        </button>
        <button
          onClick={() => setActiveView('cheatsheet')}
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium ${
            activeView === 'cheatsheet' ? 'text-indigo-400' : 'text-slate-400'
          }`}
        >
          <BookMarked className="w-4 h-4" />
          Tactics
        </button>
        <button
          onClick={() => setActiveView('leaderboard')}
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium ${
            activeView === 'leaderboard' ? 'text-indigo-400' : 'text-slate-400'
          }`}
        >
          <Trophy className="w-4 h-4" />
          Rank
        </button>
      </div>
    </header>
  );
};
