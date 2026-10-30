import React from 'react';
import { useGame } from '../context/GameContext';
import { INITIAL_LEADERBOARD } from '../data/leaderboard';
import { Trophy, Award, Flame, Medal, Sparkles } from 'lucide-react';

export const LeaderboardView: React.FC = () => {
  const { profile, badges } = useGame();

  // Insert current user into leaderboard or update
  const userEntry = {
    id: 'current_user',
    username: profile.username,
    avatar: profile.avatar,
    xp: profile.xp,
    level: profile.level,
    streak: profile.streak,
    isCurrentUser: true,
  };

  const allUsers = [...INITIAL_LEADERBOARD, userEntry].sort((a, b) => b.xp - a.xp);
  const userRank = allUsers.findIndex(u => u.isCurrentUser) + 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-100">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
          <Trophy className="w-3.5 h-3.5 text-indigo-400" />
          Global Competitive Ranking
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">Leaderboard & Achievements</h1>
        <p className="text-slate-400 text-sm sm:text-base">
          Compare your formal proof XP, streaks, and mastery badges with theorem provers worldwide.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Leaderboard Table */}
        <div className="lg:col-span-8 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
          <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <h2 className="font-bold text-slate-100 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" /> Provers Hall of Fame
            </h2>
            <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-semibold">
              Your Rank: #{userRank}
            </span>
          </div>

          <div className="divide-y divide-slate-800">
            {allUsers.map((user, idx) => {
              const rank = idx + 1;
              const isTop3 = rank <= 3;

              return (
                <div
                  key={user.id}
                  className={`p-4 sm:p-5 flex items-center justify-between transition-colors ${
                    user.isCurrentUser ? 'bg-indigo-600/10 border-l-4 border-indigo-500' : 'hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm ${
                      rank === 1 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      rank === 2 ? 'bg-slate-300/20 text-slate-300 border border-slate-300/30' :
                      rank === 3 ? 'bg-amber-700/20 text-amber-600 border border-amber-700/30' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xl">{user.avatar}</span>
                      <div>
                        <div className="font-bold text-slate-200 text-sm flex items-center gap-2">
                          {user.username}
                          {user.isCurrentUser && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold">You</span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400">Level {user.level} Prover</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
                      <Flame className="w-4 h-4 text-amber-500" />
                      {user.streak}d
                    </div>
                    <div className="text-right">
                      <div className="font-extrabold text-indigo-400 text-sm">{user.xp} XP</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Badges & Achievements Gallery */}
        <div className="lg:col-span-4 rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-100 flex items-center gap-2">
              <Award className="w-5 h-5 text-violet-400" /> Badges Gallery
            </h2>
            <span className="text-xs text-slate-400">
              {profile.unlockedBadges.length} / {badges.length} Unlocked
            </span>
          </div>

          <div className="space-y-3">
            {badges.map((badge) => {
              const isUnlocked = profile.unlockedBadges.includes(badge.id);

              return (
                <div
                  key={badge.id}
                  className={`p-4 rounded-xl border flex items-center gap-4 transition-all ${
                    isUnlocked
                      ? 'bg-slate-950 border-violet-500/30 shadow-lg shadow-violet-500/5'
                      : 'bg-slate-950/40 border-slate-800/60 opacity-50'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                    isUnlocked ? 'bg-violet-500/20 border border-violet-500/30' : 'bg-slate-800 border border-slate-700'
                  }`}>
                    {badge.icon}
                  </div>
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-200 text-sm flex items-center gap-2">
                      {badge.title}
                      {isUnlocked && <Sparkles className="w-3.5 h-3.5 text-violet-400" />}
                    </div>
                    <p className="text-xs text-slate-400">{badge.description}</p>
                    <div className="text-[10px] text-slate-500 font-medium pt-1">Req: {badge.requirement}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
