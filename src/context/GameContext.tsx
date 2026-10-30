import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Badge } from '../types';
import { BADGES } from '../data/achievements';
import confetti from 'canvas-confetti';

interface GameContextType {
  profile: UserProfile;
  activeView: 'dashboard' | 'curriculum' | 'playground' | 'cheatsheet' | 'leaderboard' | 'chat' | 'game' | 'review' | 'repository';
  setActiveView: (view: 'dashboard' | 'curriculum' | 'playground' | 'cheatsheet' | 'leaderboard' | 'chat' | 'game' | 'review' | 'repository') => void;
  selectedLessonId: string | null;
  selectedExerciseId: string | null;
  selectExercise: (lessonId: string, exerciseId: string) => void;
  completeExercise: (exerciseId: string, xpEarned: number) => void;
  reviewExercise: (exerciseId: string, rating: number) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  badges: Badge[];
  checkDailyStreak: () => void;
  resetProgress: () => void;
  exportData: () => string;
  importData: (jsonData: string) => boolean;
}

const STORAGE_KEY = 'leancraft_user_profile_v1';

const defaultProfile: UserProfile = {
  username: 'LeanScholar',
  avatar: '🧙‍♂️',
  xp: 150,
  level: 2,
  streak: 3,
  hearts: 5,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completedExercises: ['ex_1_1_1'],
  completedNodes: ['node_1_1'],
  unlockedBadges: ['first_qed', 'streak_3'],
  dailyChallengeCompletedDate: null,
  srsItems: {},
  aiGeneratedQuestions: [],
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load profile', e);
    }
    return defaultProfile;
  });

  const [activeView, setActiveView] = useState<'dashboard' | 'curriculum' | 'playground' | 'cheatsheet' | 'leaderboard' | 'chat' | 'game' | 'review' | 'repository'>('dashboard');
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile', e);
    }
  }, [profile]);

  const checkDailyStreak = () => {
    const today = new Date().toISOString().split('T')[0];
    if (profile.lastActiveDate === today) return;

    const lastDate = new Date(profile.lastActiveDate);
    const currentDate = new Date(today);
    const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Streak continues
      setProfile(prev => ({
        ...prev,
        streak: prev.streak + 1,
        lastActiveDate: today,
      }));
    } else if (diffDays > 1) {
      // Streak reset
      setProfile(prev => ({
        ...prev,
        streak: 1,
        lastActiveDate: today,
      }));
    }
  };

  const selectExercise = (lessonId: string, exerciseId: string) => {
    setSelectedLessonId(lessonId);
    setSelectedExerciseId(exerciseId);
    setActiveView('curriculum');
  };

  const completeExercise = (exerciseId: string, xpEarned: number) => {
    setProfile(prev => {
      if (prev.completedExercises.includes(exerciseId)) {
        return prev; // Already completed
      }

      const newCompleted = [...prev.completedExercises, exerciseId];
      const newXp = prev.xp + xpEarned;
      const newLevel = Math.floor(newXp / 500) + 1;

      // Check badge unlocks
      const newBadges = [...prev.unlockedBadges];
      if (newCompleted.length >= 1 && !newBadges.includes('first_qed')) {
        newBadges.push('first_qed');
      }
      if (prev.streak >= 3 && !newBadges.includes('streak_3')) {
        newBadges.push('streak_3');
      }
      if (prev.streak >= 7 && !newBadges.includes('streak_7')) {
        newBadges.push('streak_7');
      }
      if (newCompleted.length >= 5 && !newBadges.includes('logic_adept')) {
        newBadges.push('logic_adept');
      }
      if (newLevel >= 5 && !newBadges.includes('type_theorist')) {
        newBadges.push('type_theorist');
      }

      // Trigger confetti celebration
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore if confetti fails
      }

      return {
        ...prev,
        completedExercises: newCompleted,
        xp: newXp,
        level: newLevel,
        unlockedBadges: newBadges,
      };
    });
  };

  const reviewExercise = (exerciseId: string, rating: number) => {
    setProfile(prev => {
      const srsItems = { ...(prev.srsItems || {}) };
      const current = srsItems[exerciseId] || { interval: 1, repetition: 0, easeFactor: 2.5, dueDate: new Date().toISOString().split('T')[0] };

      let { interval, repetition, easeFactor } = current;

      if (rating < 1) {
        repetition = 0;
        interval = 1;
      } else {
        if (repetition === 0) interval = 1;
        else if (repetition === 1) interval = 6;
        else interval = Math.round(interval * easeFactor);
        repetition += 1;
      }

      easeFactor = Math.max(1.3, easeFactor + (0.1 - (2 - rating) * (0.08 + (2 - rating) * 0.02)));

      const today = new Date();
      const dueDateMs = today.getTime() + interval * 24 * 60 * 60 * 1000;
      const dueDate = new Date(dueDateMs).toISOString().split('T')[0];

      srsItems[exerciseId] = { interval, repetition, easeFactor, dueDate };

      return {
        ...prev,
        srsItems,
        xp: prev.xp + 25,
      };
    });
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const resetProgress = () => {
    setProfile(defaultProfile);
    localStorage.removeItem(STORAGE_KEY);
  };

  const exportData = () => {
    return JSON.stringify(profile, null, 2);
  };

  const importData = (jsonData: string) => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed && typeof parsed.username === 'string' && typeof parsed.xp === 'number') {
        setProfile(parsed);
        return true;
      }
    } catch (e) {
      console.error('Invalid import data', e);
    }
    return false;
  };

  return (
    <GameContext.Provider
      value={{
        profile,
        activeView,
        setActiveView,
        selectedLessonId,
        selectedExerciseId,
        selectExercise,
        completeExercise,
        reviewExercise,
        updateProfile,
        badges: BADGES,
        checkDailyStreak,
        resetProgress,
        exportData,
        importData,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
