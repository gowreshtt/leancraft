import { Module } from '../types';

export const CURRICULUM_MODULES: Module[] = [
  {
    id: 'mod_1',
    title: 'Module 1: Propositional Logic',
    description: 'Master the absolute fundamentals of Lean 4: propositions, assumptions, and basic connectives like conjunction (and) and disjunction (or).',
    iconName: 'Cpu',
    difficulty: 'Beginner',
    lessons: [
      {
        id: 'les_1_1',
        moduleId: 'mod_1',
        title: '1.1 Your First Proof: exact and intro',
        summary: 'Learn how to introduce hypotheses into your context and discharge goals using exact matches.',
        difficulty: 'Beginner',
        contentMarkdown: `
# Welcome to Lean 4 Prover!

In Lean 4, mathematical theorems are statements (types), and proofs are programs of those types (the **Curry-Howard Correspondence**).

When you start a theorem like:
\`\`\`lean
example (P : Prop) (h : P) : P := by
\`\`\`
The goal state shows what you need to prove below the turnstile symbol (\`⊢\`).
- \`intro h\` moves hypotheses from the goal into your local context.
- \`exact h\` finishes the proof when your local hypothesis matches the goal precisely.
        `,
        exercises: [
          {
            id: 'ex_1_1_1',
            title: 'Identity of Propositions',
            description: 'Prove that if hypothesis P is true, then P holds.',
            theoremStatement: 'example (P : Prop) (h : P) : P',
            initialCode: `example (P : Prop) (h : P) : P := by
  -- Type your tactic here (e.g. exact h)
  sorry`,
            initialGoals: ['P : Prop', 'h : P', '⊢ P'],
            solutionTactics: ['exact h'],
            hints: ['Use the exact tactic with your hypothesis h.'],
            explanation: 'The `exact h` tactic directly provides the term `h` of type `P`, completing the proof.',
            xpReward: 50,
          },
          {
            id: 'ex_1_1_2',
            title: 'Implication Introduction',
            description: 'Prove that P implies P by introducing P into the context.',
            theoremStatement: 'example (P : Prop) : P → P',
            initialCode: `example (P : Prop) : P → P := by
  -- Introduce hypothesis P
  sorry`,
            initialGoals: ['P : Prop', '⊢ P → P'],
            solutionTactics: ['intro h', 'exact h'],
            hints: ['Use `intro h` to name the hypothesis P, then `exact h`.'],
            explanation: 'The `intro h` tactic unpacks the implication `P → P` by assuming `P` and adding it to your context as `h: P` with goal `P`.',
            xpReward: 75,
          },
        ],
      },
      {
        id: 'les_1_2',
        moduleId: 'mod_1',
        title: '1.2 Conjunctions (And) and Constructor',
        summary: 'Learn how to prove conjunctions using constructor and unpack them using cases orrcases.',
        difficulty: 'Beginner',
        contentMarkdown: `
# Conjunctions (\`∧\`)

To prove \`P ∧ Q\`, you must prove both \`P\` and \`Q\`.
- The \`constructor\` tactic splits a conjunction goal into two separate subgoals: \`⊢ P\` and \`⊢ Q\`.
- If you have a hypothesis \`h : P ∧ Q\`, you can decompose it using \`rcases h with ⟨hP, hQ⟩\`.
        `,
        exercises: [
          {
            id: 'ex_1_2_1',
            title: 'Symmetry of And',
            description: 'Given P and Q, prove Q and P.',
            theoremStatement: 'example (P Q : Prop) (h : P ∧ Q) : Q ∧ P',
            initialCode: `example (P Q : Prop) (h : P ∧ Q) : Q ∧ P := by
  -- Deconstruct h and prove Q ∧ P
  sorry`,
            initialGoals: ['P Q : Prop', 'h : P ∧ Q', '⊢ Q ∧ P'],
            solutionTactics: ['rcases h with ⟨hp, hq⟩', 'constructor', 'exact hq', 'exact hp'],
            hints: [
              'Use `rcases h with ⟨hp, hq⟩` to extract `hp` and `hq`.',
              'Use `constructor` to split the goal into two subgoals.',
              'Solve each branch with `exact hq` and `exact hp`.',
            ],
            explanation: '`rcases` breaks down structures, and `constructor` handles both sides of the logical AND.',
            xpReward: 100,
          },
        ],
      },
    ],
  },
  {
    id: 'mod_2',
    title: 'Module 2: Implication & Negation',
    description: 'Explore implication chains, logical negation (not), and proof by contradiction.',
    iconName: 'ShieldAlert',
    difficulty: 'Intermediate',
    lessons: [
      {
        id: 'les_2_1',
        moduleId: 'mod_2',
        title: '2.1 Modus Ponens & Implication Chains',
        summary: 'Chain implications together using apply and exact.',
        difficulty: 'Intermediate',
        contentMarkdown: `
# Implication Chaining

- \`apply h\` matches the conclusion of \`h\` with the current goal and replaces the goal with the hypotheses of \`h\`.
- \`exfalso\` replaces any goal with \`False\`, useful when you have a contradiction in your hypotheses.
        `,
        exercises: [
          {
            id: 'ex_2_1_1',
            title: 'Modus Ponens Chain',
            description: 'Given P → Q and Q → R and P, prove R.',
            theoremStatement: 'example (P Q R : Prop) (h1 : P → Q) (h2 : Q → R) (hp : P) : R',
            initialCode: `example (P Q R : Prop) (h1 : P → Q) (h2 : Q → R) (hp : P) : R := by
  -- Apply h2, then apply h1
  sorry`,
            initialGoals: ['P Q R : Prop', 'h1 : P → Q', 'h2 : Q → R', 'hp : P', '⊢ R'],
            solutionTactics: ['apply h2', 'apply h1', 'exact hp'],
            hints: [
              'Use `apply h2` to reduce goal R to Q.',
              'Use `apply h1` to reduce goal Q to P.',
              'Finish with `exact hp`.',
            ],
            explanation: '`apply` works backward from the goal, turning a goal `R` into the prerequisite `Q` required by `h2`.',
            xpReward: 120,
          },
        ],
      },
      {
        id: 'les_2_2',
        moduleId: 'mod_2',
        title: '2.2 Proof by Contradiction',
        summary: 'Use classical reasoning and by_contra to prove negated statements.',
        difficulty: 'Intermediate',
        contentMarkdown: `
# Negation and Contradiction

In Lean, \`¬P\` is defined as \`P → False\`.
- \`by_contra h\` assumes the negation of the goal to reach a contradiction \`False\`.
- \`contradiction\` automatically searches your hypotheses for contradictory pairs like \`h : P\` and \`hnot : ¬P\`.
        `,
        exercises: [
          {
            id: 'ex_2_2_1',
            title: 'Double Negation Introduction',
            description: 'Prove that if P holds, then not not P holds.',
            theoremStatement: 'example (P : Prop) (h : P) : ¬¬P',
            initialCode: `example (P : Prop) (h : P) : ¬¬P := by
  -- Unfold ¬ and use hypothesis h
  sorry`,
            initialGoals: ['P : Prop', 'h : P', '⊢ ¬¬P'],
            solutionTactics: ['intro hnot', 'exact hnot h'],
            hints: ['Introduce `hnot : ¬P`, then apply `hnot` to `h`.'],
            explanation: 'Since `¬¬P` is `(P → False) → False`, introducing `hnot : P → False` and applying it to `h : P` yields `False`.',
            xpReward: 150,
          },
        ],
      },
    ],
  },
  {
    id: 'mod_3',
    title: 'Module 3: Quantifiers & Equality',
    description: 'Master universal (forall) and existential (exists) quantifiers, plus equational reasoning with rw and rfl.',
    iconName: 'Binary',
    difficulty: 'Intermediate',
    lessons: [
      {
        id: 'les_3_1',
        moduleId: 'mod_3',
        title: '3.1 Equality and Rewrite (rw)',
        summary: 'Substitute equal terms using the rw tactic and reflexivity (rfl).',
        difficulty: 'Intermediate',
        contentMarkdown: `
# Equational Reasoning

- \`rfl\` proves equalities that are definitionally true (e.g. \`2 + 2 = 4\` or \`x = x\`).
- \`rw [h]\` replaces occurrences of the left-hand side of \`h\` with its right-hand side.
        `,
        exercises: [
          {
            id: 'ex_3_1_1',
            title: 'Symmetry of Equality',
            description: 'Given a = b, prove b = a.',
            theoremStatement: 'example (α : Type) (a b : α) (h : a = b) : b = a',
            initialCode: `example (α : Type) (a b : α) (h : a = b) : b = a := by
  -- Rewrite using h
  sorry`,
            initialGoals: ['α : Type', 'a b : α', 'h : a = b', '⊢ b = a'],
            solutionTactics: ['rw [h]'],
            hints: ['Use `rw [h]` to substitute `a` for `b` in the goal.'],
            explanation: 'Rewriting with `h : a = b` transforms the goal `b = b`, which is solved automatically by reflexivity or handled by rewriting.',
            xpReward: 130,
          },
        ],
      },
      {
        id: 'les_3_2',
        moduleId: 'mod_3',
        title: '3.2 Universal Quantifiers (∀)',
        summary: 'Prove statements holding for all elements in a domain.',
        difficulty: 'Intermediate',
        contentMarkdown: `
# Universal Quantifiers

To prove \`∀ x : α, P x\`, use \`intro x\` to take an arbitrary element \`x\` and prove \`P x\`.
To use a hypothesis \`h : ∀ x, P x\`, you can instantiate it with a specific term \`a\` using \`have := h a\` or \`specialize h a\`.
        `,
        exercises: [
          {
            id: 'ex_3_2_1',
            title: 'Distributivity of Forall over And',
            description: 'Prove (∀ x, P x ∧ Q x) → (∀ x, P x)',
            theoremStatement: 'example (α : Type) (P Q : α → Prop) (h : ∀ x, P x ∧ Q x) : ∀ x, P x',
            initialCode: `example (α : Type) (P Q : α → Prop) (h : ∀ x, P x ∧ Q x) : ∀ x, P x := by
  -- Introduce x, then extract P x from h x
  sorry`,
            initialGoals: ['α : Type', 'P Q : α → Prop', 'h : ∀ x, P x ∧ Q x', '⊢ ∀ x, P x'],
            solutionTactics: ['intro x', 'rcases h x with ⟨hp, hq⟩', 'exact hp'],
            hints: [
              'Use `intro x` to fix an arbitrary element `x`.',
              'Use `rcases h x with ⟨hp, hq⟩` to unpack the conjunction at `x`.',
            ],
            explanation: 'Instantiating the universal hypothesis at `x` gives `P x ∧ Q x`, which `rcases` easily splits.',
            xpReward: 160,
          },
        ],
      },
    ],
  },
  {
    id: 'mod_4',
    title: 'Module 4: Arithmetic & Induction',
    description: 'Conquer natural numbers, automated arithmetic solvers (linarith, omega), and mathematical induction.',
    iconName: 'Compass',
    difficulty: 'Advanced',
    lessons: [
      {
        id: 'les_4_1',
        moduleId: 'mod_4',
        title: '4.1 Automated Solvers: omega and linarith',
        summary: 'Let Lean automatically solve linear arithmetic and Presburger arithmetic.',
        difficulty: 'Advanced',
        contentMarkdown: `
# Arithmetic Tactics

Lean 4 has powerful automated decision procedures:
- \`linarith\`: Solves linear inequalities over natural numbers and reals.
- \`omega\`: A decision procedure for Presburger arithmetic (linear integer and natural number arithmetic with multiplication by constants).
        `,
        exercises: [
          {
            id: 'ex_4_1_1',
            title: 'Simple Inequality Chain',
            description: 'If x + 5 < y and y < 10, prove x < 5 for natural numbers.',
            theoremStatement: 'example (x y : ℕ) (h1 : x + 5 < y) (h2 : y < 10) : x < 5',
            initialCode: `example (x y : ℕ) (h1 : x + 5 < y) (h2 : y < 10) : x < 5 := by
  -- Use omega or linarith
  sorry`,
            initialGoals: ['x y : ℕ', 'h1 : x + 5 < y', 'h2 : y < 10', '⊢ x < 5'],
            solutionTactics: ['omega'],
            hints: ['The `omega` tactic solves linear integer and natural number arithmetic instantly.'],
            explanation: '`omega` analyzes the linear constraints and deduces `x < 5` without manual algebraic steps.',
            xpReward: 150,
          },
        ],
      },
      {
        id: 'les_4_2',
        moduleId: 'mod_4',
        title: '4.2 Mathematical Induction on Nat',
        summary: 'Prove properties for all natural numbers using structural induction.',
        difficulty: 'Advanced',
        contentMarkdown: `
# Induction on Natural Numbers

To prove \`∀ n : ℕ, P n\`:
- Use \`induction n with | zero => ... | succ n ih => ...\`
- This generates two cases:
  1. Base case: \`P 0\`
  2. Inductive step: assuming \`P n\` (the induction hypothesis \`ih\`), prove \`P (n + 1)\`.
        `,
        exercises: [
          {
            id: 'ex_4_2_1',
            title: 'Sum of First N Integers (Induction)',
            description: 'Prove 0 + 1 + ... + n properties or simple nat identities.',
            theoremStatement: 'example (n : ℕ) : 0 + n = n',
            initialCode: `example (n : ℕ) : 0 + n = n := by
  -- Induction on n or use omega
  sorry`,
            initialGoals: ['n : ℕ', '⊢ 0 + n = n'],
            solutionTactics: ['omega'],
            hints: ['Try `omega` or manual `induction n`.'],
            explanation: 'While induction works, `omega` knows addition properties of natural numbers directly.',
            xpReward: 200,
          },
        ],
      },
    ],
  },
  {
    id: 'mod_5',
    title: 'Module 5: Lists & Data Structures',
    description: 'Work with algebraic data types, lists, append associativity, and structural induction.',
    iconName: 'Layers',
    difficulty: 'Advanced',
    lessons: [
      {
        id: 'les_5_1',
        moduleId: 'mod_5',
        title: '5.1 List Append Associativity',
        summary: 'Prove properties of list operations using structural induction.',
        difficulty: 'Advanced',
        contentMarkdown: `
# Structural Induction on Lists

Lists in Lean are inductively defined:
- \`[]\` (nil)
- \`x :: xs\` (cons)

To prove properties of lists for all \`xs\`, use \`induction xs with | nil => ... | cons x xs ih => ...\`.
        `,
        exercises: [
          {
            id: 'ex_5_1_1',
            title: 'Nil Append Identity',
            description: 'Prove that appending nil to a list xs equals xs.',
            theoremStatement: 'example (α : Type) (xs : List α) : xs ++ [] = xs',
            initialCode: `example (α : Type) (xs : List α) : xs ++ [] = xs := by
  -- Induction on xs
  induction xs with
  | nil => rfl
  | cons x xs ih => 
    -- complete inductive step
    sorry`,
            initialGoals: ['α : Type', 'x : α', 'xs : List α', 'ih : xs ++ [] = xs', '⊢ (x :: xs) ++ [] = x :: xs'],
            solutionTactics: ['rw [List.cons_append, ih]'],
            hints: ['Rewrite with `List.cons_append` and apply induction hypothesis `ih`.'],
            explanation: 'List append on the left distributes over cons, allowing the induction hypothesis to finish the proof.',
            xpReward: 250,
          },
        ],
      },
    ],
  },
];
