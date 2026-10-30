import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot, User, Trash2 } from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  content: string;
}

export const ChatbotView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: "Hello! I am LambdaTutor, your expert AI assistant for Lean 4 theorem proving. Ask me about any tactics (like intro, rcases, omega), error messages, or mathlib proofs!"
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: 'model', content: data.reply || data.error || 'No response.' }]);
    } catch (e) {
      setMessages([...newMessages, { role: 'model', content: 'Sorry, I encountered a network error while connecting to LambdaTutor.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 h-[calc(100vh-120px)] flex flex-col space-y-4 text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-slate-100 flex items-center gap-2">
              LambdaTutor AI Assistant <Sparkles className="w-4 h-4 text-violet-400" />
            </h2>
            <p className="text-xs text-slate-400">Expert Lean 4 & Type Theory Conversational Coach</p>
          </div>
        </div>
        <button
          onClick={() => setMessages([{ role: 'model', content: "Chat history cleared. What Lean theorem or tactic would you like to discuss?" }])}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1.5 transition-colors"
          title="Clear chat"
        >
          <Trash2 className="w-4 h-4" /> Clear
        </button>
      </div>

      {/* Chat Thread */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-inner">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'model' && (
              <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              m.role === 'user'
                ? 'bg-indigo-600 text-white rounded-br-none shadow-lg shadow-indigo-600/20'
                : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none shadow'
            }`}>
              <div className="whitespace-pre-wrap font-mono text-xs sm:text-sm">{m.content}</div>
            </div>
            {m.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-950 border border-slate-800 text-slate-400 rounded-2xl px-4 py-3 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
              LambdaTutor is formulating a response...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask LambdaTutor a question about Lean 4 tactics, proofs, or errors..."
          className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-violet-500 shadow-lg"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-semibold text-sm shadow-lg shadow-violet-600/20 transition-all flex items-center gap-2"
        >
          <Send className="w-4 h-4" /> Send
        </button>
      </form>
    </div>
  );
};
