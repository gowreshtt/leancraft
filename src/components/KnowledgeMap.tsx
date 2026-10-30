import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { DUO_UNITS } from '../data/duoCurriculum';
import { DuoNode } from '../types';
import { Network, CheckCircle2, Lock, ArrowRight, Sparkles, BookOpen } from 'lucide-react';

interface KnowledgeMapProps {
  onSelectNode?: (node: DuoNode) => void;
}

export const KnowledgeMap: React.FC<KnowledgeMapProps> = ({ onSelectNode }) => {
  const { profile, setActiveView } = useGame();
  const [hoveredNode, setHoveredNode] = useState<DuoNode | null>(null);

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl text-slate-100">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-base">Lean 4 Knowledge Dependency Map</h3>
            <p className="text-xs text-slate-400">Visual prerequisite graph of formal theorem proving topics</p>
          </div>
        </div>
        <button
          onClick={() => setActiveView('curriculum')}
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
        >
          Open Path <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Graph Visualizer container */}
      <div className="relative p-6 rounded-2xl bg-slate-950 border border-slate-800 overflow-x-auto min-h-[320px] flex items-center justify-around gap-8">
        {DUO_UNITS.map((unit, unitIdx) => {
          return (
            <div key={unit.id} className="flex flex-col items-center space-y-6 relative">
              <div className="text-xs uppercase tracking-wider font-bold text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                Unit {unitIdx + 1}
              </div>

              <div className="flex flex-col items-center space-y-8 relative">
                {unit.nodes.map((node, nodeIdx) => {
                  const isCompleted = profile.completedNodes?.includes(node.id) || (nodeIdx === 0 && unitIdx === 0);
                  const isUnlocked = isCompleted || nodeIdx === 0 || profile.completedNodes?.includes(unit.nodes[nodeIdx - 1]?.id);

                  return (
                    <div
                      key={node.id}
                      className="relative flex flex-col items-center group"
                      onMouseEnter={() => setHoveredNode(node)}
                      onMouseLeave={() => setHoveredNode(null)}
                    >
                      <button
                        onClick={() => {
                          if (isUnlocked && onSelectNode) {
                            onSelectNode(node);
                          } else if (isUnlocked) {
                            setActiveView('curriculum');
                          }
                        }}
                        disabled={!isUnlocked}
                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-2xl shadow-xl transition-all transform group-hover:scale-110 border-2 ${
                          isCompleted
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-emerald-500/10'
                            : isUnlocked
                            ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300 shadow-indigo-500/20 animate-pulse'
                            : 'bg-slate-900 border-slate-800 text-slate-600 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        {isUnlocked ? node.icon : <Lock className="w-4 h-4" />}
                      </button>

                      <div className="absolute top-18 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-center shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 whitespace-nowrap">
                        <div className="font-bold text-xs text-slate-100">{node.title}</div>
                        <div className="text-[10px] text-indigo-400">{isCompleted ? 'Completed (Mastered)' : isUnlocked ? 'Unlocked' : 'Prerequisite Locked'}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {unitIdx < DUO_UNITS.length - 1 && (
                <div className="hidden md:block absolute -right-6 top-1/2 w-6 h-0.5 bg-indigo-500/30" />
              )}
            </div>
          );
        })}
      </div>

      {hoveredNode && (
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
          <div>
            <span className="font-bold text-slate-200">{hoveredNode.title}: </span>
            <span className="text-slate-400">{hoveredNode.description}</span>
          </div>
          <span className="text-indigo-400 font-semibold">+{hoveredNode.xpReward} XP</span>
        </div>
      )}
    </div>
  );
};
