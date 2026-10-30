import React, { useState } from 'react';
import { BookMarked, Search, Copy, Check } from 'lucide-react';

interface TacticItem {
  name: string;
  syntax: string;
  description: string;
  example: string;
  category: 'Basic' | 'Logic' | 'Equality' | 'Arithmetic' | 'Induction';
}

const TACTICS: TacticItem[] = [
  {
    name: 'intro / intros',
    syntax: 'intro h',
    description: 'Moves hypotheses or bound variables from the goal into the local context.',
    example: 'example (P : Prop) : P → P := by\n  intro h\n  exact h',
    category: 'Basic',
  },
  {
    name: 'exact',
    syntax: 'exact term',
    description: 'Closes the current goal when you provide an exact term or hypothesis of matching type.',
    example: 'example (P : Prop) (h : P) : P := by\n  exact h',
    category: 'Basic',
  },
  {
    name: 'apply',
    syntax: 'apply theorem',
    description: 'Applies an implication or theorem backwards, transforming goal Q into prerequisite P.',
    example: 'example (P Q : Prop) (h : P → Q) (hp : P) : Q := by\n  apply h\n  exact hp',
    category: 'Logic',
  },
  {
    name: 'constructor',
    syntax: 'constructor',
    description: 'Splits a goal whose type is an inductive datatype with a single constructor (like ∧ or ⟨,⟩) into subgoals.',
    example: 'example (P Q : Prop) (hp : P) (hq : Q) : P ∧ Q := by\n  constructor\n  · exact hp\n  · exact hq',
    category: 'Logic',
  },
  {
    name: 'rcases / cases',
    syntax: 'rcases h with ⟨hp, hq⟩',
    description: 'Deconstructs compound hypotheses (like conjunctions or inductive structures) into components.',
    example: 'example (P Q : Prop) (h : P ∧ Q) : P := by\n  rcases h with ⟨hp, _⟩\n  exact hp',
    category: 'Logic',
  },
  {
    name: 'rw (Rewrite)',
    syntax: 'rw [h]',
    description: 'Substitutes occurrences of the left-hand side of equality `h` with its right-hand side.',
    example: 'example (a b c : ℕ) (h : a = b) : a + c = b + c := by\n  rw [h]',
    category: 'Equality',
  },
  {
    name: 'rfl (Reflexivity)',
    syntax: 'rfl',
    description: 'Proves equalities that are definitionally true by computation or syntactic identity.',
    example: 'example : 2 + 2 = 4 := by\n  rfl',
    category: 'Equality',
  },
  {
    name: 'omega',
    syntax: 'omega',
    description: 'Automated decision procedure for Presburger arithmetic (linear integer and natural number constraints).',
    example: 'example (x y : ℕ) (h : x + 2 < y) : x < y := by\n  omega',
    category: 'Arithmetic',
  },
  {
    name: 'linarith',
    syntax: 'linarith',
    description: 'Solves linear arithmetic inequalities over natural numbers, integers, and reals.',
    example: 'example (a b : ℝ) (h1 : a < b) : a < b + 1 := by\n  linarith',
    category: 'Arithmetic',
  },
  {
    name: 'induction',
    syntax: 'induction n with | zero => ... | succ n ih => ...',
    description: 'Performs mathematical or structural induction on natural numbers, lists, or inductive types.',
    example: 'example (n : ℕ) : 0 + n = n := by\n  omega',
    category: 'Induction',
  },
];

export const Cheatsheet: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const categories = ['All', 'Basic', 'Logic', 'Equality', 'Arithmetic', 'Induction'];

  const filteredTactics = TACTICS.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.syntax.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-100">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
          <BookMarked className="w-3.5 h-3.5 text-indigo-400" />
          Lean 4 Reference
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">Tactic Cheat Sheet</h1>
        <p className="text-slate-400 text-sm sm:text-base">
          Quick reference guide for essential Lean 4 tactics, syntax, and proof patterns.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tactics (e.g. intro, rcases, omega)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tactics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTactics.map((t, idx) => (
          <div key={idx} className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-lg flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-100 text-base">{t.name}</h3>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-indigo-400 font-semibold">
                  {t.category}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{t.description}</p>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-indigo-300">
                {t.syntax}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-[10px] uppercase font-semibold text-slate-500">
                <span>Example Usage</span>
                <button
                  onClick={() => handleCopy(t.example, idx)}
                  className="flex items-center gap-1 text-slate-400 hover:text-indigo-400 transition-colors"
                >
                  {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedIndex === idx ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="p-3 rounded-xl bg-slate-950 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
                {t.example}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
