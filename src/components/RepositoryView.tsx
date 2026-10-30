import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { CURRICULUM_MODULES } from '../data/curriculum';
import { DuoNode } from '../types';
import { BookMarked, Search, Sparkles, FolderArchive, CheckCircle2, ChevronRight } from 'lucide-react';

export const RepositoryView: React.FC = () => {
  const { profile } = useGame();
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Collect all static curriculum lessons and exercises
  const staticLessons = CURRICULUM_MODULES.flatMap(m => m.lessons);
  const aiGeneratedQuestions = profile.aiGeneratedQuestions || [];

  const filteredLessons = staticLessons.filter(l =>
    l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAiQs = aiGeneratedQuestions.filter((q: any) =>
    q.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.theoremStatement?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-100">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold">
          <FolderArchive className="w-3.5 h-3.5 text-violet-400" />
          Knowledge Repository & Archive
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">Lessons & Questions Repository</h1>
        <p className="text-slate-400 text-sm sm:text-base">
          Explore the complete catalog of taught Lean 4 lessons, formal theorems, and AI-generated practice questions.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search lessons, theorems, or AI questions..."
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-violet-500 shadow-lg"
        />
      </div>

      {/* AI Generated Questions Repository */}
      {aiGeneratedQuestions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-400" /> AI-Generated Custom Questions ({aiGeneratedQuestions.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAiQs.map((q: any, idx: number) => (
              <div key={idx} className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 font-semibold">
                    AI Generated
                  </span>
                  <span className="text-xs text-slate-400">+{q.xpReward || 50} XP</span>
                </div>
                <h3 className="font-bold text-slate-100 text-base">{q.title}</h3>
                <div className="p-3 rounded-xl bg-slate-950 font-mono text-xs text-indigo-300">
                  {q.theoremStatement}
                </div>
                <p className="text-xs text-slate-400">{q.prompt}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Static Curriculum Lessons Repository */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
          <BookMarked className="w-5 h-5 text-indigo-400" /> Curriculum Lessons Catalog ({staticLessons.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredLessons.map((les) => (
            <div key={les.id} className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${
                  les.difficulty === 'Beginner' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  les.difficulty === 'Intermediate' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                  'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                  {les.difficulty}
                </span>
                <span className="text-xs text-slate-400">{les.exercises.length} exercises</span>
              </div>
              <h3 className="font-bold text-slate-100 text-base">{les.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{les.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
