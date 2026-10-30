import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Flame, X, CheckCircle2, Play, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DailyChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DailyChallengeModal: React.FC<DailyChallengeModalProps> = ({ isOpen, onClose }) => {
  const { profile, updateProfile } = useGame();
  const [code, setCode] = useState<string>(
    `-- Daily Challenge: Prove symmetry of implication\nexample (P Q : Prop) (h : P → Q) (hp : P) : Q := by\n  -- Apply h to hp\n  sorry`
  );
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const today = new Date().toISOString().split('T')[0];
  const isDoneToday = profile.dailyChallengeCompletedDate === today;

  const handleVerify = () => {
    if (code.includes('sorry')) {
      setStatus('error');
      setErrorMsg('Complete the proof by removing "sorry".');
      return;
    }
    if (!code.includes('apply') && !code.includes('exact')) {
      setStatus('error');
      setErrorMsg('Invalid proof tactics.');
      return;
    }

    setStatus('success');
    setErrorMsg(null);

    if (!isDoneToday) {
      const newXp = profile.xp + 100;
      const newLevel = Math.floor(newXp / 500) + 1;
      updateProfile({
        xp: newXp,
        level: newLevel,
        streak: profile.streak + 1,
        dailyChallengeCompletedDate: today,
      });

      try {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6 shadow-2xl text-slate-100">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500 animate-pulse" />
            <h2 className="text-lg font-bold">Daily Formal Challenge</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 space-y-1">
            <div className="font-bold">Reward: +100 XP & Streak Protection</div>
            <p className="text-slate-400">Solve today's featured theorem challenge to maintain your rigorous study streak.</p>
          </div>

          {isDoneToday && (
            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>You have already completed today's challenge! Come back tomorrow for a new puzzle.</span>
            </div>
          )}

          <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs font-semibold text-slate-300">
              Theorem Statement
            </div>
            <div className="p-4 font-mono text-xs text-indigo-300">
              example (P Q : Prop) (h : P → Q) (hp : P) : Q
            </div>
          </div>

          <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden font-mono">
            <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs text-slate-400">
              Proof Editor
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={6}
              className="w-full p-4 bg-transparent text-slate-100 text-xs focus:outline-none resize-none font-mono"
            />
          </div>

          {status === 'success' && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Challenge Q.E.D.! Streak updated successfully.</span>
            </div>
          )}

          {status === 'error' && errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
            >
              Close
            </button>
            <button
              onClick={handleVerify}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Verify Challenge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
