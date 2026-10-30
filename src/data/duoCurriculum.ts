import { Unit } from '../types';

export const DUO_UNITS: Unit[] = [
  {
    id: 'unit_1',
    title: 'Unit 1: Propositional Logic Foundations',
    description: 'Master hypotheses, assumptions, exact matching, and conjunctions (∧).',
    color: 'from-emerald-500 to-teal-600',
    nodes: [
      {
        id: 'node_1_1',
        unitId: 'unit_1',
        title: 'Introduction to Exact',
        description: 'Learn how to close goals with exact matching hypotheses.',
        icon: '🌱',
        type: 'multiple_choice',
        xpReward: 20,
        questions: [
          {
            prompt: 'Which tactic closes a goal when your hypothesis `h` precisely matches the goal `P`?',
            codeSnippet: 'example (P : Prop) (h : P) : P := by\n  -- what goes here?',
            options: ['exact h', 'intro h', 'omega', 'induction h'],
            correctAnswer: 'exact h',
            explanation: 'The `exact` tactic supplies a term of the exact type required by the goal.'
          },
          {
            prompt: 'What does the turnstile symbol (⊢) represent in a Lean 4 goal state?',
            options: ['Proves that the hypotheses on the right imply the goal on the left', 'Separates local hypotheses above from the current goal below', 'A syntax error', 'Definitional reflexivity'],
            correctAnswer: 'Separates local hypotheses above from the current goal below',
            explanation: 'The turnstile ⊢ divides your context (hypotheses) from what you are trying to prove (the goal).'
          }
        ]
      },
      {
        id: 'node_1_2',
        unitId: 'unit_1',
        title: 'Implication Introduction',
        description: 'Learn how to unpack `P → Q` using the `intro` tactic.',
        icon: '🦉',
        type: 'fill_blank',
        xpReward: 30,
        questions: [
          {
            prompt: 'Fill in the blank to introduce hypothesis P:',
            codeSnippet: 'example (P : Prop) : P → P := by\n  _____ h\n  exact h',
            options: ['intro', 'exact', 'apply', 'rw'],
            correctAnswer: 'intro',
            explanation: '`intro h` assumes the premise P and adds it to your local context as `h`.'
          }
        ]
      },
      {
        id: 'node_1_3',
        unitId: 'unit_1',
        title: 'Conjunction Constructor',
        description: 'Prove `P ∧ Q` using `constructor`.',
        icon: '⚡',
        type: 'tactic_builder',
        xpReward: 40,
        questions: [
          {
            prompt: 'Assemble the tactics to prove P ∧ Q from hp : P and hq : Q:',
            codeSnippet: 'example (P Q : Prop) (hp : P) (hq : Q) : P ∧ Q',
            options: ['constructor', 'exact hp', 'exact hq'],
            correctAnswer: 'constructor',
            explanation: '`constructor` splits a conjunction goal into two subgoals: ⊢ P and ⊢ Q.'
          }
        ]
      },
      {
        id: 'node_1_4',
        unitId: 'unit_1',
        title: 'Unit 1 Checkpoint: Conjunction Symmetry',
        description: 'Final boss battle for Unit 1!',
        icon: '🏆',
        type: 'proof_editor',
        xpReward: 100,
        questions: [],
        exercise: {
          id: 'ex_duo_1',
          title: 'Conjunction Symmetry',
          description: 'Given P ∧ Q, prove Q ∧ P.',
          theoremStatement: 'example (P Q : Prop) (h : P ∧ Q) : Q ∧ P',
          initialCode: `example (P Q : Prop) (h : P ∧ Q) : Q ∧ P := by
  -- Deconstruct h and reconstruct Q ∧ P
  sorry`,
          initialGoals: ['P Q : Prop', 'h : P ∧ Q', '⊢ Q ∧ P'],
          solutionTactics: ['rcases h with ⟨hp, hq⟩', 'constructor', 'exact hq', 'exact hp'],
          hints: ['Use `rcases h with ⟨hp, hq⟩` then `constructor`.'],
          explanation: 'rcases splits the pair and constructor builds the reversed pair.',
          xpReward: 100,
        }
      }
    ]
  },
  {
    id: 'unit_2',
    title: 'Unit 2: Implication Chains & Negation',
    description: 'Master Modus Ponens (`apply`), proof by contradiction (`by_contra`), and negation.',
    color: 'from-violet-500 to-purple-600',
    nodes: [
      {
        id: 'node_2_1',
        unitId: 'unit_2',
        title: 'Modus Ponens with apply',
        description: 'Work backwards from goals using implication hypotheses.',
        icon: '🛡️',
        type: 'multiple_choice',
        xpReward: 30,
        questions: [
          {
            prompt: 'Given `h : P → Q` and goal `⊢ Q`, which tactic reduces the goal to `⊢ P`?',
            codeSnippet: 'example (P Q : Prop) (h : P → Q) (hp : P) : Q := by',
            options: ['apply h', 'exact h', 'intro h', 'rfl'],
            correctAnswer: 'apply h',
            explanation: '`apply h` matches the conclusion of `h` with the goal and leaves the premise as the new goal.'
          }
        ]
      },
      {
        id: 'node_2_2',
        unitId: 'unit_2',
        title: 'Proof by Contradiction',
        description: 'Assume the negation to reach False.',
        icon: '🔮',
        type: 'fill_blank',
        xpReward: 40,
        questions: [
          {
            prompt: 'Fill in the blank for proof by contradiction:',
            codeSnippet: 'example (P : Prop) : ¬¬P := by\n  _____ hnot\n  exact hnot h',
            options: ['by_contra', 'intro', 'exact', 'omega'],
            correctAnswer: 'by_contra',
            explanation: '`by_contra h` introduces the negated assumption to derive a contradiction.'
          }
        ]
      },
      {
        id: 'node_2_3',
        unitId: 'unit_2',
        title: 'Unit 2 Checkpoint: Modus Ponens Chain',
        description: 'Master implication chaining.',
        icon: '🏆',
        type: 'proof_editor',
        xpReward: 120,
        questions: [],
        exercise: {
          id: 'ex_duo_2',
          title: 'Modus Ponens Chain',
          description: 'Given P → Q, Q → R, and P, prove R.',
          theoremStatement: 'example (P Q R : Prop) (h1 : P → Q) (h2 : Q → R) (hp : P) : R',
          initialCode: `example (P Q R : Prop) (h1 : P → Q) (h2 : Q → R) (hp : P) : R := by
  -- Apply h2, then apply h1
  sorry`,
          initialGoals: ['P Q R : Prop', 'h1 : P → Q', 'h2 : Q → R', 'hp : P', '⊢ R'],
          solutionTactics: ['apply h2', 'apply h1', 'exact hp'],
          hints: ['Use `apply h2` then `apply h1`.'],
          explanation: 'Chaining backwards with apply solves implication stacks.',
          xpReward: 120,
        }
      }
    ]
  },
  {
    id: 'unit_3',
    title: 'Unit 3: Arithmetic & Omega',
    description: 'Conquer natural numbers, linear inequalities, and automated solvers.',
    color: 'from-amber-500 to-orange-600',
    nodes: [
      {
        id: 'node_3_1',
        unitId: 'unit_3',
        title: 'Reflexivity with rfl',
        description: 'Prove trivial equalities instantly.',
        icon: '✨',
        type: 'multiple_choice',
        xpReward: 30,
        questions: [
          {
            prompt: 'Which tactic proves `2 + 2 = 4` instantly?',
            options: ['rfl', 'omega', 'exact', 'intro'],
            correctAnswer: 'rfl',
            explanation: '`rfl` (reflexivity) evaluates definitionally equal arithmetic expressions.'
          }
        ]
      },
      {
        id: 'node_3_2',
        unitId: 'unit_3',
        title: 'Presburger Arithmetic with omega',
        description: 'Automated linear integer & nat solver.',
        icon: '🌌',
        type: 'multiple_choice',
        xpReward: 40,
        questions: [
          {
            prompt: 'Which powerful tactic solves linear inequality constraints over natural numbers automatically?',
            codeSnippet: 'example (x y : ℕ) (h : x + 5 < y) : x < y := by',
            options: ['omega', 'rfl', 'constructor', 'exact h'],
            correctAnswer: 'omega',
            explanation: '`omega` is Lean 4\'s built-in decision procedure for Presburger arithmetic.'
          }
        ]
      },
      {
        id: 'node_3_3',
        unitId: 'unit_3',
        title: 'Unit 3 Checkpoint: Inequality Solver',
        description: 'Put omega to the test.',
        icon: '🏆',
        type: 'proof_editor',
        xpReward: 150,
        questions: [],
        exercise: {
          id: 'ex_duo_3',
          title: 'Inequality Solver',
          description: 'If x + 5 < y and y < 10, prove x < 5.',
          theoremStatement: 'example (x y : ℕ) (h1 : x + 5 < y) (h2 : y < 10) : x < 5',
          initialCode: `example (x y : ℕ) (h1 : x + 5 < y) (h2 : y < 10) : x < 5 := by
  -- Use omega
  sorry`,
          initialGoals: ['x y : ℕ', 'h1 : x + 5 < y', 'h2 : y < 10', '⊢ x < 5'],
          solutionTactics: ['omega'],
          hints: ['Type `omega` to let Lean solve linear arithmetic.'],
          explanation: 'omega instantly discharges linear natural number arithmetic.',
          xpReward: 150,
        }
      }
    ]
  }
];
