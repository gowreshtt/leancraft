import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Sparkles, Play, CheckCircle2, AlertCircle, ArrowRight, X, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AIQuizGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIQuizGenerator: React.FC<AIQuizGeneratorProps> = ({ isOpen, onClose }) => {
  const { profile, updateProfile } = useGame();
  const [topic, setTopic] = useState<string>('Propositional Logic & Conjunctions');
  const [difficulty, setDifficulty] = useState<string>('Intermediate');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [question, setQuestion] = useState<any | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setQuestion(null);
    setSelectedOption(null);
    setIsAnswerChecked(false);

    try {
      const res = await fetch('/api/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, difficulty }),
      });
      const data = await res.json();
      setQuestion(data);

      // Save into repository in profile
      const currentRepo = profile.aiGeneratedQuestions || [];
      updateProfile({ aiGeneratedQuestions: [data, ...currentRepo] });
    } catch (err) {
      console.error('Failed to generate AI question', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheck = () => {
    if (!selectedOption || !question) return;
    const correct = selectedOption === question.correctAnswer;
    setIsCorrect(correct);
    setIsAnswerChecked(true);

    if (correct) {
      const newXp = profile.xp + (question.xpReward || 50);
      const newLevel = Math.floor(newXp / 500) + 1;
      updateProfile({ xp: newXp, level: newLevel });
      try {
        confetti({ particleCount: 90, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl text-slate-100 relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-400" />
            <h2 className="text-lg font-bold">AI Infinite Question Generator</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!question ? (
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">Theorem Topic / Concept</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Induction, Implication Chains, List Append..."
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-violet-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-violet-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3.5 rounded-2xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-violet-600/20 transition-all flex items-center gap-2"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {isLoading ? 'Generating Theorem...' : 'Generate New AI Question'}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 font-semibold">
                  {question.title}
                </span>
                <span className="text-xs font-bold text-indigo-400">+{question.xpReward || 50} XP</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-indigo-300 overflow-x-auto">
                {question.theoremStatement}
              </div>
              <h3 className="font-bold text-slate-100 text-sm pt-2">{question.prompt}</h3>
            </div>

            <div className="space-y-2.5">
              {question.options?.map((opt: string, idx: number) => {
                const isSelected = selectedOption === opt;
                return (
                  <button
                    key={idx}
                    onClick={() => !isAnswerChecked && setSelectedOption(opt)}
                    disabled={isAnswerChecked}
                    className={`w-full p-3.5 rounded-2xl border text-left font-mono text-xs transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-violet-600/20 border-violet-500 text-violet-300'
                        : 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <span>{opt}</span>
                    <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                      isSelected ? 'bg-violet-500 border-violet-400 text-white' : 'border-slate-700'
                    }`}>
                      {isSelected ? '✓' : ''}
                    </span>
                  </button>
                );
              })}
            </div>

            {isAnswerChecked && (
              <div className={`p-4 rounded-2xl border text-xs space-y-1 ${
                isCorrect ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300' : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
              }`}>
                <div className="font-bold flex items-center gap-2">
                  {isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
                  {isCorrect ? 'Correct!' : 'Incorrect!'}
                </div>
                <p className="text-slate-300 text-xs">{question.explanation}</p>
              </div>
            )}

            <div className="pt-2 flex justify-between items-center">
              <button
                onClick={() => setQuestion(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Generate Another
              </button>

              {!isAnswerChecked ? (
                <button
                  onClick={handleCheck}
                  disabled={!selectedOption}
                  className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-violet-600/20"
                >
                  Check Answer
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20"
                >
                  Done
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
