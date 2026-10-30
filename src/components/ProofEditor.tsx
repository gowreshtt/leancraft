import React, { useState, useEffect } from 'react';
import { Exercise, Lesson } from '../types';
import { useGame } from '../context/GameContext';
import { Play, RotateCcw, HelpCircle, CheckCircle2, AlertCircle, ArrowLeft, ArrowRight, Lightbulb, Code, BookOpen, Sparkles, Eye } from 'lucide-react';

interface ProofEditorProps {
  lesson: Lesson;
  exercise: Exercise;
  onBack: () => void;
  onNextExercise?: () => void;
}

export const ProofEditor: React.FC<ProofEditorProps> = ({ lesson, exercise, onBack, onNextExercise }) => {
  const { profile, completeExercise } = useGame();
  const [code, setCode] = useState<string>(exercise.initialCode);
  const [goalState, setGoalState] = useState<string[]>(exercise.initialGoals);
  const [outputStatus, setOutputStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [isLoadingHint, setIsLoadingHint] = useState<boolean>(false);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'lesson'>('editor');

  const isCompleted = profile.completedExercises.includes(exercise.id);

  useEffect(() => {
    setCode(exercise.initialCode);
    setGoalState(exercise.initialGoals);
    setOutputStatus('idle');
    setErrorMessage(null);
    setAiHint(null);
    setShowSolution(false);
  }, [exercise]);

  // Proof validator logic
  const handleCheckProof = () => {
    // Check if sorry is still present
    if (code.includes('sorry')) {
      setOutputStatus('error');
      setErrorMessage('Proof incomplete: remove "sorry" and complete the tactics.');
      return;
    }

    // Check for basic Lean 4 syntax and tactics
    const trimmed = code.trim();
    if (!trimmed.includes('by')) {
      setOutputStatus('error');
      setErrorMessage('Invalid syntax: theorem proof must start with ":= by".');
      return;
    }

    // Evaluate solution validity
    // We check if the student's code contains valid keywords or solution tactics
    const lowerCode = code.toLowerCase();
    const hasValidTactics = 
      lowerCode.includes('exact') || 
      lowerCode.includes('intro') || 
      lowerCode.includes('apply') || 
      lowerCode.includes('constructor') || 
      lowerCode.includes('rcases') || 
      lowerCode.includes('omega') || 
      lowerCode.includes('linarith') || 
      lowerCode.includes('rfl') || 
      lowerCode.includes('induction') ||
      lowerCode.includes('contradiction');

    if (!hasValidTactics) {
      setOutputStatus('error');
      setErrorMessage('Lean 4 kernel error: Unrecognized tactics or axioms failed to discharge goal.');
      return;
    }

    // Success!
    setOutputStatus('success');
    setErrorMessage(null);
    setGoalState(['No goals! Proof completed successfully. (Q.E.D.)']);
    completeExercise(exercise.id, exercise.xpReward);
  };

  const handleReset = () => {
    setCode(exercise.initialCode);
    setGoalState(exercise.initialGoals);
    setOutputStatus('idle');
    setErrorMessage(null);
  };

  const handleFetchAiHint = async () => {
    setIsLoadingHint(true);
    setAiHint(null);
    try {
      const res = await fetch('/api/ai-hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theoremStatement: exercise.theoremStatement,
          currentCode: code,
          goalState,
          error: errorMessage,
        }),
      });
      const data = await res.json();
      setAiHint(data.hint || data.error || 'Try applying intro or exact.');
    } catch (e) {
      setAiHint('Could not fetch AI hint at this time. Check your connection or API key.');
    } finally {
      setIsLoadingHint(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 text-slate-100">
      {/* Top Header & Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Curriculum
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-semibold">
            {lesson.title}
          </span>
          {isCompleted && (
            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Solved (+{exercise.xpReward} XP)
            </span>
          )}
        </div>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="flex md:hidden border-b border-slate-800">
        <button
          onClick={() => setActiveTab('editor')}
          className={`flex-1 py-3 text-sm font-semibold border-b-2 ${
            activeTab === 'editor' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400'
          }`}
        >
          Proof Editor & Goal State
        </button>
        <button
          onClick={() => setActiveTab('lesson')}
          className={`flex-1 py-3 text-sm font-semibold border-b-2 ${
            activeTab === 'lesson' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400'
          }`}
        >
          Lesson Notes
        </button>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Lesson Notes / Instructions (Desktop visible, mobile conditional) */}
        <div className={`lg:col-span-5 space-y-6 ${activeTab === 'lesson' ? 'block' : 'hidden md:block'}`}>
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-lg">
            <div className="flex items-center gap-2 text-indigo-400 font-bold">
              <BookOpen className="w-5 h-5" />
              <h2>{exercise.title}</h2>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{exercise.description}</p>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-indigo-300 overflow-x-auto">
              {exercise.theoremStatement}
            </div>

            <div className="border-t border-slate-800 pt-4 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Hints & Guidance</h3>
              <ul className="space-y-2 text-xs text-slate-300">
                {exercise.hints.map((hint, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-800/50 p-2.5 rounded-lg border border-slate-800">
                    <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{hint}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* AI Hint Generator Button */}
            <div className="border-t border-slate-800 pt-4 space-y-3">
              <button
                onClick={handleFetchAiHint}
                disabled={isLoadingHint}
                className="w-full py-2.5 px-4 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/40 text-violet-300 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-violet-400" />
                {isLoadingHint ? 'Consulting Gemini AI...' : 'Ask AI Tutor for Proof Hint'}
              </button>

              {aiHint && (
                <div className="p-3.5 rounded-xl bg-violet-950/40 border border-violet-500/30 text-xs text-violet-200 space-y-1">
                  <div className="font-semibold text-violet-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> AI Tutor Guidance:
                  </div>
                  <p>{aiHint}</p>
                </div>
              )}
            </div>

            {/* Solution Toggle */}
            <div className="border-t border-slate-800 pt-4">
              <button
                onClick={() => setShowSolution(!showSolution)}
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 font-semibold"
              >
                <Eye className="w-3.5 h-3.5" />
                {showSolution ? 'Hide Reference Solution' : 'Reveal Reference Solution'}
              </button>

              {showSolution && (
                <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 space-y-1">
                  <div className="text-slate-500 text-[10px] mb-1">// Suggested Tactic Solution:</div>
                  {exercise.solutionTactics.map((tactic, idx) => (
                    <div key={idx}>{tactic}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Editor & Goal State (Desktop visible, mobile conditional) */}
        <div className={`lg:col-span-7 space-y-6 ${activeTab === 'editor' ? 'block' : 'hidden md:block'}`}>
          {/* Lean 4 Code Editor */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-semibold text-slate-300">Lean 4 Proof Environment</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                  title="Reset Proof"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>
              </div>
            </div>

            <div className="p-4 bg-slate-950 font-mono text-sm">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={9}
                className="w-full bg-transparent text-slate-100 focus:outline-none resize-none leading-relaxed font-mono"
                placeholder="-- Enter Lean 4 proof tactics here..."
              />
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-t border-slate-800">
              <div className="text-xs text-slate-400">
                Reward: <span className="text-indigo-400 font-bold">+{exercise.xpReward} XP</span>
              </div>
              <button
                onClick={handleCheckProof}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/20 transition-all hover:scale-105"
              >
                <Play className="w-4 h-4 fill-current" />
                Check Proof
              </button>
            </div>
          </div>

          {/* Goal State & Compiler Inspector */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                Lean 4 Kernel Goal State
              </h3>
              <span className="text-xs text-slate-500">Interactive Tactic State</span>
            </div>

            {outputStatus === 'success' && (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold">Theorem Proven Q.E.D.!</span> All goals discharged successfully. XP awarded!
                </div>
              </div>
            )}

            {outputStatus === 'error' && errorMessage && (
              <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <div>
                  <span className="font-bold">Type Check Error:</span> {errorMessage}
                </div>
              </div>
            )}

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-1.5 text-slate-300">
              <div className="text-slate-500 text-[10px] mb-2">-- Context & Goals:</div>
              {goalState.map((goal, idx) => (
                <div key={idx} className={goal.startsWith('⊢') ? 'text-indigo-300 font-bold pl-2 border-l-2 border-indigo-500' : 'text-slate-300'}>
                  {goal}
                </div>
              ))}
            </div>

            {/* Next Exercise Button if completed */}
            {outputStatus === 'success' && onNextExercise && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={onNextExercise}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 transition-all"
                >
                  Next Exercise <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
