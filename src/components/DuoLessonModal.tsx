import React, { useState } from 'react';
import { DuoNode } from '../types';
import { useGame } from '../context/GameContext';
import { ProofEditor } from './ProofEditor';
import { Heart, X, CheckCircle2, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DuoLessonModalProps {
  node: DuoNode;
  onClose: () => void;
}

export const DuoLessonModal: React.FC<DuoLessonModalProps> = ({ node, onClose }) => {
  const { profile, updateProfile, completeExercise } = useGame();
  const [currentQIdx, setCurrentQIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [hearts, setHearts] = useState<number>(profile.hearts ?? 5);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // If node type is proof_editor, render ProofEditor directly
  if (node.type === 'proof_editor' && node.exercise) {
    // Create a mock lesson wrapper for ProofEditor
    const mockLesson = {
      id: node.id,
      moduleId: node.unitId,
      title: node.title,
      summary: node.description,
      contentMarkdown: node.description,
      difficulty: 'Beginner' as const,
      exercises: [node.exercise],
    };

    return (
      <div className="fixed inset-0 z-50 bg-slate-950 overflow-y-auto">
        <div className="p-4 flex justify-between items-center border-b border-slate-800 bg-slate-900">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{node.icon}</span>
            <span className="font-bold text-slate-100">{node.title}</span>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <ProofEditor
          lesson={mockLesson}
          exercise={node.exercise}
          onBack={onClose}
          onNextExercise={() => {
            completeExercise(node.exercise!.id, node.xpReward);
            setIsFinished(true);
          }}
        />
      </div>
    );
  }

  const questions = node.questions || [];
  const currentQ = questions[currentQIdx];

  const handleCheckAnswer = () => {
    if (!selectedOption) return;

    const correct = selectedOption === currentQ.correctAnswer;
    setIsCorrect(correct);
    setIsAnswerChecked(true);

    if (!correct) {
      const newHearts = Math.max(0, hearts - 1);
      setHearts(newHearts);
      updateProfile({ hearts: newHearts });
    }
  };

  const handleNext = () => {
    setIsAnswerChecked(false);
    setSelectedOption(null);

    if (currentQIdx + 1 < questions.length) {
      setCurrentQIdx(i => i + 1);
    } else {
      setIsFinished(true);
      const newXp = profile.xp + node.xpReward;
      const newLevel = Math.floor(newXp / 500) + 1;
      const newCompleted = [...profile.completedNodes, node.id];
      updateProfile({ xp: newXp, level: newLevel, completedNodes: newCompleted });

      try {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl text-slate-100 relative">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-xl">
              {node.icon}
            </div>
            <div>
              <h2 className="font-bold text-slate-100 text-base">{node.title}</h2>
              <div className="text-xs text-slate-400">Question {currentQIdx + 1} of {questions.length}</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-rose-400 font-bold text-sm">
              <Heart className="w-5 h-5 fill-current animate-pulse" />
              <span>{hearts}</span>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-200">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300"
            style={{ width: `${((currentQIdx + (isFinished ? 1 : 0)) / questions.length) * 100}%` }}
          />
        </div>

        {isFinished ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-4xl">
              🏆
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-extrabold text-emerald-300">Lesson Complete!</h3>
              <p className="text-slate-400 text-sm">You earned <span className="text-indigo-400 font-bold">+{node.xpReward} XP</span> for your theorem mastery.</p>
            </div>
            <button
              onClick={onClose}
              className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all"
            >
              Continue Path
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Question Prompt */}
            <div className="space-y-3">
              <h3 className="font-bold text-slate-100 text-base leading-relaxed">{currentQ.prompt}</h3>
              {currentQ.codeSnippet && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-indigo-300 overflow-x-auto whitespace-pre-wrap">
                  {currentQ.codeSnippet}
                </div>
              )}
            </div>

            {/* Options */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === opt;
                return (
                  <button
                    key={idx}
                    onClick={() => !isAnswerChecked && setSelectedOption(opt)}
                    disabled={isAnswerChecked}
                    className={`w-full p-4 rounded-2xl border text-left font-mono text-xs sm:text-sm transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-lg shadow-indigo-500/10'
                        : 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <span>{opt}</span>
                    <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs ${
                      isSelected ? 'bg-indigo-500 border-indigo-400 text-white' : 'border-slate-700'
                    }`}>
                      {isSelected ? '✓' : ''}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Answer Feedback Banner */}
            {isAnswerChecked && (
              <div className={`p-4 rounded-2xl border text-xs sm:text-sm space-y-1 ${
                isCorrect ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300' : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
              }`}>
                <div className="font-bold flex items-center gap-2">
                  {isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
                  {isCorrect ? 'Correct!' : 'Incorrect!'}
                </div>
                <p className="text-slate-300 text-xs">{currentQ.explanation}</p>
              </div>
            )}

            {/* Bottom Action */}
            <div className="pt-2 flex justify-end">
              {!isAnswerChecked ? (
                <button
                  onClick={handleCheckAnswer}
                  disabled={!selectedOption}
                  className="px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-indigo-600/20 transition-all"
                >
                  Check Answer
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
