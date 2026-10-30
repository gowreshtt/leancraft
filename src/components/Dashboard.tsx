import React from 'react';
import { useGame } from '../context/GameContext';
import { CURRICULUM_MODULES } from '../data/curriculum';
import { Flame, Award, Trophy, ArrowRight, CheckCircle2, Play, BookOpen, Sparkles, ShieldCheck } from 'lucide-react';
import { KnowledgeMap } from './KnowledgeMap';

interface DashboardProps {
  onOpenDaily: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onOpenDaily }) => {
  const { profile, setActiveView, selectExercise } = useGame();

  // Calculate total exercises across curriculum
  const totalExercises = CURRICULUM_MODULES.reduce(
    (acc, mod) => acc + mod.lessons.reduce((lAcc, les) => lAcc + les.exercises.length, 0),
    0
  );
  const completedCount = profile.completedExercises.length;
  const progressPercent = Math.min(100, Math.round((completedCount / totalExercises) * 100));

  // Find next uncompleted exercise
  let nextExercise: { lessonId: string; exerciseId: string; title: string; moduleTitle: string } | null = null;
  for (const mod of CURRICULUM_MODULES) {
    for (const les of mod.lessons) {
      for (const ex of les.exercises) {
        if (!profile.completedExercises.includes(ex.id)) {
          nextExercise = {
            lessonId: les.id,
            exerciseId: ex.id,
            title: ex.title,
            moduleTitle: mod.title,
          };
          break;
        }
      }
      if (nextExercise) break;
    }
    if (nextExercise) break;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-100">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/20 p-6 sm:p-8 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Lean 4 Formal Proof Academy
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Welcome back, <span className="bg-gradient-to-r from-indigo-400 to-violet-300 bg-clip-text text-transparent">{profile.username}</span>!
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl">
              Formalize mathematical reasoning step-by-step. Keep your streak burning and conquer dependent type theory.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-3">
              <div className="w-12 h-12 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-2xl font-bold">
                🔥
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-400">{profile.streak} Days</div>
                <div className="text-xs text-slate-400">Current Streak</div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-3">
              <div className="w-12 h-12 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-2xl font-bold">
                ⭐
              </div>
              <div>
                <div className="text-2xl font-bold text-indigo-400">{profile.xp}</div>
                <div className="text-xs text-slate-400">Total XP (Lvl {profile.level})</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action / Resume Card */}
      {nextExercise ? (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-lg">
          <div className="space-y-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Continue Learning</div>
            <h2 className="text-xl font-bold text-slate-100">{nextExercise.title}</h2>
            <p className="text-sm text-slate-400">{nextExercise.moduleTitle}</p>
          </div>
          <button
            onClick={() => selectExercise(nextExercise!.lessonId, nextExercise!.exerciseId)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/20 transition-all hover:scale-105"
          >
            <Play className="w-4 h-4 fill-current" />
            Resume Theorem
          </button>
        </div>
      ) : (
        <div className="rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-500/30 p-6 text-center space-y-3">
          <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto" />
          <h2 className="text-2xl font-bold text-emerald-300">All Curriculum Exercises Completed!</h2>
          <p className="text-slate-400 text-sm">You have mastered all available Lean 4 theorems. Try the Sandbox or wait for new challenges!</p>
        </div>
      )}

      {/* Progress & Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Overall Progress */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-200">Overall Progress</h3>
            <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
              {progressPercent}% Done
            </span>
          </div>
          <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="flex justify-between text-xs text-slate-400">
            <span>{completedCount} of {totalExercises} exercises solved</span>
            <span>Level {profile.level} Prover</span>
          </div>
        </div>

        {/* Daily Challenge Card */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Daily Challenge</span>
              <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">+100 XP</span>
            </div>
            <h4 className="font-bold text-slate-200">Propositional Logic Sprint</h4>
            <p className="text-xs text-slate-400">Complete today's featured proof puzzle to maintain your streak and earn bonus XP.</p>
          </div>
          <button
            onClick={onOpenDaily}
            className="mt-4 w-full py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
          >
            <Flame className="w-4 h-4 text-amber-500" />
            Open Daily Challenge
          </button>
        </div>

        {/* Badges Unlocked */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">Badges Unlocked</span>
              <span className="text-xs font-bold text-violet-400">{profile.unlockedBadges.length} / 7</span>
            </div>
            <h4 className="font-bold text-slate-200">Formal Achievements</h4>
            <div className="flex items-center gap-2 pt-2">
              {profile.unlockedBadges.slice(0, 4).map((badgeId, idx) => (
                <div key={idx} className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-lg" title={badgeId}>
                  {badgeId === 'first_qed' ? '🏆' : badgeId.includes('streak') ? '🔥' : '🧠'}
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => setActiveView('leaderboard')}
            className="mt-4 text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            View all badges & leaderboard <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Knowledge Map Component */}
      <KnowledgeMap />

      {/* Modules Overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-100">Curriculum Modules</h3>
          <button
            onClick={() => setActiveView('curriculum')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            View all lessons <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CURRICULUM_MODULES.map((mod) => {
            const modExercises = mod.lessons.flatMap(l => l.exercises);
            const modCompleted = modExercises.filter(ex => profile.completedExercises.includes(ex.id)).length;
            const modPercent = Math.round((modCompleted / modExercises.length) * 100);

            return (
              <div
                key={mod.id}
                onClick={() => setActiveView('curriculum')}
                className="group rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 p-6 cursor-pointer transition-all hover:shadow-xl hover:shadow-indigo-500/5 flex flex-col justify-between gap-6"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-lg">
                      {mod.difficulty === 'Beginner' ? '🌱' : mod.difficulty === 'Intermediate' ? '⚡' : '🧙‍♂️'}
                    </span>
                    <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${
                      mod.difficulty === 'Beginner' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      mod.difficulty === 'Intermediate' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                      'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {mod.difficulty}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">{mod.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">{mod.description}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>{modCompleted} / {modExercises.length} completed</span>
                    <span>{modPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full rounded-full transition-all duration-300" style={{ width: `${modPercent}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
