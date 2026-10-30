import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Play, Trophy, RotateCcw, Flame, Sparkles, Shield, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Puzzle {
  goal: string;
  options: { text: string; isCorrect: boolean }[];
  explanation: string;
}

const PUZZLES: Puzzle[] = [
  {
    goal: "⊢ P → P",
    options: [
      { text: "intro h; exact h", isCorrect: true },
      { text: "omega", isCorrect: false },
      { text: "induction n", isCorrect: false }
    ],
    explanation: "To prove P → P, introduce the hypothesis with 'intro h' and exact match it."
  },
  {
    goal: "⊢ 2 + 2 = 4",
    options: [
      { text: "rfl", isCorrect: true },
      { text: "constructor", isCorrect: false },
      { text: "by_contra", isCorrect: false }
    ],
    explanation: "Definitional equalities are solved instantly by reflexivity (rfl)."
  },
  {
    goal: "x y : ℕ, h : x + 5 < y ⊢ x < y",
    options: [
      { text: "omega", isCorrect: true },
      { text: "exact h", isCorrect: false },
      { text: "intro h", isCorrect: false }
    ],
    explanation: "Linear natural number inequalities are automatically solved by the omega tactic."
  },
  {
    goal: "P Q : Prop ⊢ P ∧ Q → Q ∧ P",
    options: [
      { text: "intro h; rcases h with ⟨hp, hq⟩; constructor <;> assumption", isCorrect: true },
      { text: "rfl", isCorrect: false },
      { text: "linarith", isCorrect: false }
    ],
    explanation: "Deconstruct the conjunction with rcases and reconstruct with constructor."
  },
  {
    goal: "n : ℕ ⊢ 0 + n = n",
    options: [
      { text: "omega", isCorrect: true },
      { text: "exact h", isCorrect: false },
      { text: "apply h", isCorrect: false }
    ],
    explanation: "Omega handles nat addition identities directly."
  }
];

export const ProofGame: React.FC = () => {
  const { profile, updateProfile } = useGame();
  const [gameState, setGameState] = useState<'title' | 'playing' | 'gameover' | 'victory'>('title');
  const [currentPuzzleIdx, setCurrentPuzzleIdx] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameState('gameover');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, currentPuzzleIdx]);

  const startGame = () => {
    setGameState('playing');
    setCurrentPuzzleIdx(0);
    setScore(0);
    setCombo(0);
    setTimeLeft(15);
    setFeedback(null);
  };

  const handleSelectOption = (isCorrect: boolean) => {
    if (isCorrect) {
      const pts = 100 + combo * 25 + timeLeft * 5;
      setScore(s => s + pts);
      setCombo(c => c + 1);
      setFeedback('Correct Tactic! 🎉');

      if (currentPuzzleIdx + 1 < PUZZLES.length) {
        setTimeout(() => {
          setCurrentPuzzleIdx(i => i + 1);
          setTimeLeft(15);
          setFeedback(null);
        }, 800);
      } else {
        // Victory!
        setGameState('victory');
        const bonusXp = 250;
        updateProfile({ xp: profile.xp + bonusXp });
        try {
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        } catch (e) {}
      }
    } else {
      setCombo(0);
      setFeedback('Incorrect Tactic! Time penalty -3s ⏱️');
      setTimeLeft(t => Math.max(0, t - 3));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {gameState === 'title' && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 border border-indigo-500/30 p-8 sm:p-12 text-center space-y-6 shadow-2xl">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 text-3xl font-bold shadow-lg shadow-indigo-500/20">
            ⚔️
          </div>
          <div className="space-y-2">
            <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 font-semibold">
              Arcade Mini-Game
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-indigo-400 via-violet-300 to-white bg-clip-text text-transparent">
              Theorem Quest Arena
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto">
              Match incoming Lean 4 type goals with the correct proof tactic before the timer runs out! Build combos and earn bonus XP.
            </p>
          </div>

          <button
            onClick={startGame}
            className="px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-base shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 flex items-center gap-2 mx-auto"
          >
            <Play className="w-5 h-5 fill-current" /> Start Theorem Quest
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
          {/* HUD */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                Puzzle {currentPuzzleIdx + 1} / {PUZZLES.length}
              </span>
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                <Flame className="w-4 h-4 text-amber-500" /> Combo x{combo}
              </span>
            </div>
            <div className="flex items-center gap-6">
              <span className={`text-sm font-bold ${timeLeft <= 5 ? 'text-rose-400 animate-pulse' : 'text-slate-300'}`}>
                ⏱️ {timeLeft}s
              </span>
              <span className="text-sm font-extrabold text-indigo-400">Score: {score}</span>
            </div>
          </div>

          {/* Goal Card */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-center">
            <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Incoming Goal State</div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-indigo-300">
              {PUZZLES[currentPuzzleIdx].goal}
            </div>
          </div>

          {feedback && (
            <div className={`p-3.5 rounded-xl text-center text-xs font-bold ${
              feedback.includes('Correct') ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-300' : 'bg-rose-950/40 border border-rose-500/30 text-rose-300'
            }`}>
              {feedback}
            </div>
          )}

          {/* Tactic Options */}
          <div className="grid grid-cols-1 gap-3">
            {PUZZLES[currentPuzzleIdx].options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectOption(opt.isCorrect)}
                className="p-4 rounded-xl bg-slate-950 hover:bg-indigo-600/20 border border-slate-800 hover:border-indigo-500/40 text-left font-mono text-sm text-slate-200 transition-all flex items-center justify-between group"
              >
                <span>{opt.text}</span>
                <span className="text-xs text-slate-500 group-hover:text-indigo-400">Select →</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {gameState === 'gameover' && (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 text-2xl font-bold">
            ⌛
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-100">Time Out!</h2>
            <p className="text-slate-400 text-sm">Your theorem proving session expired. Final Score: <span className="text-indigo-400 font-bold">{score}</span></p>
          </div>
          <button
            onClick={startGame}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 mx-auto"
          >
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
        </div>
      )}

      {gameState === 'victory' && (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-2xl font-bold">
            🏆
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-emerald-300">Theorem Quest Victory!</h2>
            <p className="text-slate-400 text-sm">You successfully dispatched all type goals with mastery.</p>
            <div className="text-xl font-bold text-indigo-400 pt-2">Final Score: {score} (+250 XP Awarded!)</div>
          </div>
          <button
            onClick={startGame}
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2 mx-auto"
          >
            <RotateCcw className="w-4 h-4" /> Play Again
          </button>
        </div>
      )}
    </div>
  );
};
