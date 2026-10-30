export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface Exercise {
  id: string;
  title: string;
  description: string;
  theoremStatement: string; // e.g. "theorem and_comm (P Q : Prop) : P ∧ Q → Q ∧ P"
  initialCode: string;
  initialGoals: string[];
  solutionTactics: string[]; // Key tactics or steps expected or evaluated
  hints: string[];
  explanation: string;
  xpReward: number;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  summary: string;
  contentMarkdown: string;
  difficulty: Difficulty;
  exercises: Exercise[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  iconName: string;
  difficulty: Difficulty;
  lessons: Lesson[];
}

export type LessonType = 'tactic_builder' | 'multiple_choice' | 'fill_blank' | 'proof_editor';

export interface DuoNode {
  id: string;
  unitId: string;
  title: string;
  description: string;
  icon: string;
  type: LessonType;
  questions: {
    prompt: string;
    codeSnippet?: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  }[];
  exercise?: Exercise;
  xpReward: number;
}

export interface Unit {
  id: string;
  title: string;
  description: string;
  color: string;
  nodes: DuoNode[];
}

export interface SRSItem {
  interval: number; // in days
  repetition: number;
  easeFactor: number;
  dueDate: string; // YYYY-MM-DD
}

export interface UserProfile {
  username: string;
  avatar: string;
  xp: number;
  level: number;
  streak: number;
  hearts: number;
  lastActiveDate: string; // YYYY-MM-DD
  completedExercises: string[];
  completedNodes: string[];
  unlockedBadges: string[]; // badge ids
  dailyChallengeCompletedDate: string | null;
  srsItems: Record<string, SRSItem>; // exerciseId -> SRSItem
  aiGeneratedQuestions?: any[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: string;
  category: 'streak' | 'completion' | 'mastery' | 'special';
}

export interface LeaderboardUser {
  id: string;
  username: string;
  avatar: string;
  xp: number;
  level: number;
  streak: number;
  isCurrentUser?: boolean;
}
