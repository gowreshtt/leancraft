import React, { useState } from 'react';
import { DUO_UNITS } from '../data/duoCurriculum';
import { useGame } from '../context/GameContext';
import { DuoLessonModal } from './DuoLessonModal';
import { DuoNode } from '../types';
import { CheckCircle2, Lock, Sparkles, Star, Trophy, Heart } from 'lucide-react';

export const PathView: React.FC = () => {
  const { profile } = useGame();
  const [activeNode, setActiveNode] = useState<DuoNode | null>(null);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-12 text-slate-100">
      {/* Mascot Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-900/60 via-violet-900/60 to-slate-900 border border-indigo-500/30 p-6 sm:p-8 flex items-center justify-between shadow-2xl">
        <div className="space-y-2">
          <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-semibold">
            Lambda Path 🦉
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Your Lean 4 Learning Path</h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-lg">
            Bite-sized, gamified theorem proving lessons. Complete nodes to earn crowns, XP, and maintain your streak!
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-4 bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
          <div className="text-3xl">🦉</div>
          <div>
            <div className="font-bold text-slate-200 text-sm">Lambda Owl</div>
            <div className="text-xs text-indigo-400">Ready for today's proof!</div>
          </div>
        </div>
      </div>

      {/* Units & Winding Path */}
      <div className="space-y-16">
        {DUO_UNITS.map((unit, unitIdx) => {
          return (
            <div key={unit.id} className="space-y-8">
              {/* Unit Header */}
              <div className={`rounded-3xl bg-gradient-to-r ${unit.color} p-6 text-white shadow-xl flex items-center justify-between`}>
                <div className="space-y-1">
                  <span className="text-xs uppercase font-bold tracking-wider opacity-80">Unit {unitIdx + 1}</span>
                  <h2 className="text-xl sm:text-2xl font-black">{unit.title}</h2>
                  <p className="text-xs opacity-90">{unit.description}</p>
                </div>
                <Trophy className="w-10 h-10 opacity-80 shrink-0" />
              </div>

              {/* Winding Path Nodes */}
              <div className="flex flex-col items-center space-y-6 py-4">
                {unit.nodes.map((node, nodeIdx) => {
                  const isCompleted = profile.completedNodes?.includes(node.id) || (nodeIdx === 0 && unitIdx === 0);
                  const isUnlocked = isCompleted || nodeIdx === 0 || profile.completedNodes?.includes(unit.nodes[nodeIdx - 1]?.id);

                  // Zig-zag offset for Duolingo path effect
                  const offsets = ['translate-x-0', 'translate-x-12 sm:translate-x-20', 'translate-x-0', '-translate-x-12 sm:-translate-x-20'];
                  const offsetClass = offsets[nodeIdx % offsets.length];

                  return (
                    <div key={node.id} className={`relative flex flex-col items-center ${offsetClass}`}>
                      <button
                        onClick={() => isUnlocked && setActiveNode(node)}
                        disabled={!isUnlocked}
                        className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center text-3xl shadow-2xl transition-all transform hover:scale-110 active:scale-95 border-4 ${
                          isCompleted
                            ? 'bg-gradient-to-tr from-amber-500 to-yellow-400 border-amber-300 text-slate-950 shadow-amber-500/20'
                            : isUnlocked
                            ? 'bg-gradient-to-tr from-indigo-600 to-violet-500 border-indigo-400 text-white shadow-indigo-600/30 animate-pulse'
                            : 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
                        }`}
                        title={node.title}
                      >
                        {isUnlocked ? (
                          <>
                            <span>{node.icon}</span>
                            <span className="text-[10px] font-extrabold uppercase mt-1 tracking-wider">
                              {isCompleted ? '👑' : 'Start'}
                            </span>
                          </>
                        ) : (
                          <Lock className="w-6 h-6 text-slate-500" />
                        )}
                      </button>
                      <div className="mt-2 text-center max-w-[140px]">
                        <span className="text-xs font-bold text-slate-300 line-clamp-1">{node.title}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {activeNode && (
        <DuoLessonModal node={activeNode} onClose={() => setActiveNode(null)} />
      )}
    </div>
  );
};
