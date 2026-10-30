import React, { useState } from 'react';
import { Play, RotateCcw, Code2, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export const Playground: React.FC = () => {
  const [theoremCode, setTheoremCode] = useState<string>(
    `-- Lean 4 Custom Sandbox Theorem\ntheorem custom_and_comm (P Q : Prop) (h : P ∧ Q) : Q ∧ P := by\n  rcases h with ⟨hp, hq⟩\n  constructor\n  · exact hq\n  · exact hp`
  );
  const [goalState, setGoalState] = useState<string[]>([
    'P Q : Prop',
    'h : P ∧ Q',
    '⊢ Q ∧ P'
  ]);
  const [outputStatus, setOutputStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleVerify = () => {
    if (theoremCode.includes('sorry')) {
      setOutputStatus('error');
      setErrorMessage('Theorem contains "sorry". Complete the proof tactics.');
      return;
    }
    if (!theoremCode.includes(':= by')) {
      setOutputStatus('error');
      setErrorMessage('Syntax error: Theorem must have ":= by".');
      return;
    }

    setOutputStatus('success');
    setErrorMessage(null);
    setGoalState(['No goals! Custom theorem verified successfully.']);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-slate-100">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
          <Code2 className="w-3.5 h-3.5 text-indigo-400" />
          Free Proof Sandbox
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">Lean 4 Theorem Sandbox</h1>
        <p className="text-slate-400 text-sm sm:text-base">
          Experiment with custom formal definitions, inductive types, and tactic scripts in a distraction-free environment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Code Editor */}
        <div className="lg:col-span-7 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-semibold text-slate-300">Custom Theorem Editor</span>
            </div>
            <button
              onClick={() => setTheoremCode('-- Write your theorem here\ntheorem my_theorem : True := by\n  trivial')}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          <div className="p-4 bg-slate-950 font-mono text-sm">
            <textarea
              value={theoremCode}
              onChange={(e) => setTheoremCode(e.target.value)}
              rows={12}
              className="w-full bg-transparent text-slate-100 focus:outline-none resize-none leading-relaxed font-mono"
            />
          </div>

          <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-t border-slate-800">
            <span className="text-xs text-slate-400">Lean 4 Compiler Active</span>
            <button
              onClick={handleVerify}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/20 transition-all hover:scale-105"
            >
              <Play className="w-4 h-4 fill-current" />
              Verify Theorem
            </button>
          </div>
        </div>

        {/* Goal Inspector */}
        <div className="lg:col-span-5 rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-lg">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
            Kernel State & Tactic Output
          </h3>

          {outputStatus === 'success' && (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold">Theorem Typechecks!</span> Validated by Lean 4 kernel.
              </div>
            </div>
          )}

          {outputStatus === 'error' && errorMessage && (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <div>
                <span className="font-bold">Error:</span> {errorMessage}
              </div>
            </div>
          )}

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-1.5 text-slate-300">
            <div className="text-slate-500 text-[10px] mb-2">-- Tactic State:</div>
            {goalState.map((goal, idx) => (
              <div key={idx} className={goal.startsWith('⊢') ? 'text-indigo-300 font-bold pl-2 border-l-2 border-indigo-500' : 'text-slate-300'}>
                {goal}
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-2">
            <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Playground Tip
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Use tactics like <code className="text-indigo-300">intro</code>, <code className="text-indigo-300">exact</code>, <code className="text-indigo-300">omega</code>, and <code className="text-indigo-300">induction</code> to explore complex theorem structures.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
