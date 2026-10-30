import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { CURRICULUM_MODULES } from '../data/curriculum';
import { Exercise } from '../types';
import { RotateCcw, CheckCircle2, Brain, Sparkles, Flame, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ReviewView: React.FC = () => {
  const { profile, reviewExercise } = useGame();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [userCode, setUserCode] = useState<string>('');
  const [isReviewed, setIsReviewed] = useState<boolean>(false);

  // Gather all exercises from curriculum
  const allExercises: Exercise[] = CURRICULUM_MODULES.flatMap(m => m.lessons.flatMap(l => l.exercises));

  const today = new Date().toISOString().split('T')[0];

  // Filter exercises that are either completed and due today, or have no SRS item yet (add initial SRS)
  const dueExercises = allExercises.filter(ex => {
    if (!profile.completedExercises?.includes(ex.id)) return false;
    const srs = profile.srsItems?.[ex.id];
    if (!srs) return true; // Due if not initialized
    return srs.dueDate <= today;
  });

  const currentExercise = dueExercises[currentIndex];

  const handleRating = (rating: number) => {
    if (!currentExercise) return;
    reviewExercise(currentExercise.id, rating);
    setShowAnswer(false);
    setUserCode('');
    setIsReviewed(true);

    try {
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
    } catch (e) {}

    setTimeout(() => {
      setIsReviewed(false);
      if (currentIndex + 1 >= dueExercises.length) {
        setCurrentIndex(0);
      }
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 text-slate-100">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-violet-900/60 via-indigo-900/60 to-slate-900 border border-violet-500/30 p-6 sm:p-8 flex items-center justify-between shadow-2xl">
        <div className="space-y-2">
          <span className="text-xs px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 font-semibold">
            Spaced Repetition (SRS)
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Forgetting Curve Review</h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-lg">
            Review Lean 4 theorems scheduled for today based on SuperMemo spaced repetition intervals.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-3 bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
          <Brain className="w-8 h-8 text-violet-400" />
          <div>
            <div className="font-bold text-slate-200 text-sm">{dueExercises.length} Due</div>
            <div className="text-xs text-slate-400">Scheduled Today</div>
          </div>
        </div>
      </div>

      {dueExercises.length === 0 ? (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-12 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-3xl">
            ✨
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-emerald-300">All Caught Up!</h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              You have no Lean theorems due for review right now. Complete more curriculum exercises or check back tomorrow!
            </p>
          </div>
        </div>
      ) : currentExercise ? (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-violet-500/10 text-violet-300 border border-violet-500/20">
              Review {currentIndex + 1} of {dueExercises.length}
            </span>
            <span className="text-xs text-slate-400 font-mono">ID: {currentExercise.id}</span>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-slate-100 text-lg">{currentExercise.title}</h3>
            <p className="text-slate-300 text-sm">{currentExercise.description}</p>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-indigo-300">
              {currentExercise.theoremStatement}
            </div>
          </div>

          {!showAnswer ? (
            <div className="space-y-4 pt-4">
              <button
                onClick={() => setShowAnswer(true)}
                className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
              >
                Show Solution & Rate Recall
              </button>
            </div>
          ) : (
            <div className="space-y-6 pt-4 border-t border-slate-800">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 space-y-1">
                <div className="text-slate-500 text-[10px] mb-1">// Reference Tactics:</div>
                {currentExercise.solutionTactics.map((tactic, idx) => (
                  <div key={idx}>{tactic}</div>
                ))}
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-400 text-center">How difficult was recalling this proof?</div>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => handleRating(0)}
                    className="py-3 px-4 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-bold text-xs transition-all"
                  >
                    🔴 Hard (Again)
                  </button>
                  <button
                    onClick={() => handleRating(1)}
                    className="py-3 px-4 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold text-xs transition-all"
                  >
                    🟡 Good
                  </button>
                  <button
                    onClick={() => handleRating(2)}
                    className="py-3 px-4 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold text-xs transition-all"
                  >
                    🟢 Easy
                  </button>
                </div>
              </div>
            </div>
          )}

          {isReviewed && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs text-center font-bold">
              SRS Interval Updated! Scheduling next review...
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
