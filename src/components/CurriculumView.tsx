import React, { useState } from 'react';
import { CURRICULUM_MODULES } from '../data/curriculum';
import { useGame } from '../context/GameContext';
import { ProofEditor } from './ProofEditor';
import { BookOpen, CheckCircle2, ChevronRight, Play, Award, Sparkles, Lock } from 'lucide-react';

export const CurriculumView: React.FC = () => {
  const { profile, selectedLessonId, selectedExerciseId, selectExercise } = useGame();
  const [activeModuleId, setActiveModuleId] = useState<string>('mod_1');

  // If an exercise is selected, render the ProofEditor
  if (selectedLessonId && selectedExerciseId) {
    let targetLesson = null;
    let targetExercise = null;

    for (const mod of CURRICULUM_MODULES) {
      for (const les of mod.lessons) {
        if (les.id === selectedLessonId) {
          targetLesson = les;
          targetExercise = les.exercises.find(ex => ex.id === selectedExerciseId) || null;
        }
      }
    }

    if (targetLesson && targetExercise) {
      return (
        <ProofEditor
          lesson={targetLesson}
          exercise={targetExercise}
          onBack={() => selectExercise('', '')} // reset selection
        />
      );
    }
  }

  const selectedModule = CURRICULUM_MODULES.find(m => m.id === activeModuleId) || CURRICULUM_MODULES[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-100">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
          Structured Curriculum
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">Lean 4 Prover Curriculum</h1>
        <p className="text-slate-400 text-sm sm:text-base">
          Master formal logic, inductive datatypes, and theorem proving step-by-step from beginner to expert.
        </p>
      </div>

      {/* Module Navigation Tabs */}
      <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-none">
        {CURRICULUM_MODULES.map((mod) => {
          const isSelected = mod.id === activeModuleId;
          const modExercises = mod.lessons.flatMap(l => l.exercises);
          const completedCount = modExercises.filter(ex => profile.completedExercises.includes(ex.id)).length;
          const isAllDone = completedCount === modExercises.length;

          return (
            <button
              key={mod.id}
              onClick={() => setActiveModuleId(mod.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300 shadow-lg shadow-indigo-500/10'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sm">
                {isAllDone ? '✅' : mod.id === 'mod_1' ? '1' : mod.id === 'mod_2' ? '2' : mod.id === 'mod_3' ? '3' : mod.id === 'mod_4' ? '4' : '5'}
              </div>
              <div>
                <div className="font-bold text-sm text-slate-200">{mod.title.split(':')[1]}</div>
                <div className="text-[11px] text-slate-400">{completedCount}/{modExercises.length} completed</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Module Details & Lessons */}
      <div className="space-y-6">
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-2">
          <h2 className="text-xl font-bold text-slate-100">{selectedModule.title}</h2>
          <p className="text-sm text-slate-400">{selectedModule.description}</p>
        </div>

        {/* Lessons List */}
        <div className="space-y-4">
          {selectedModule.lessons.map((lesson) => (
            <div key={lesson.id} className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-lg">
              <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-200">{lesson.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{lesson.summary}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${
                  lesson.difficulty === 'Beginner' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  lesson.difficulty === 'Intermediate' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                  'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                  {lesson.difficulty}
                </span>
              </div>

              {/* Exercises in Lesson */}
              <div className="divide-y divide-slate-800">
                {lesson.exercises.map((ex) => {
                  const isDone = profile.completedExercises.includes(ex.id);

                  return (
                    <div
                      key={ex.id}
                      onClick={() => selectExercise(lesson.id, ex.id)}
                      className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-800/40 cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm border ${
                          isDone
                            ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                            : 'bg-slate-800 border-slate-700 text-slate-300 group-hover:border-indigo-500/50 group-hover:text-indigo-400'
                        }`}>
                          {isDone ? <CheckCircle2 className="w-5 h-5" /> : <Play className="w-4 h-4 fill-current" />}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-200 text-sm group-hover:text-indigo-300 transition-colors">{ex.title}</h4>
                          <p className="text-xs text-slate-400 line-clamp-1">{ex.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="hidden sm:inline text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                          +{ex.xpReward} XP
                        </span>
                        <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
