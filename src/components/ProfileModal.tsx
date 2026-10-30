import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { User, Sparkles, Download, Upload, RefreshCw, X, CheckCircle2 } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AVATARS = ['🧙‍♂️', '🔬', '📐', '💡', '⚡', '🎯', '☕', '🌌', '🛡️', '🌱', '🦊', '🚀'];

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { profile, updateProfile, resetProgress, exportData, importData } = useGame();
  const [username, setUsername] = useState<string>(profile.username);
  const [avatar, setAvatar] = useState<string>(profile.avatar);
  const [importJson, setImportJson] = useState<string>('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ username, avatar });
    onClose();
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(exportData());
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `leancraft_backup_${profile.username}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImport = () => {
    const success = importData(importJson);
    if (success) {
      setImportStatus('Progress imported successfully!');
      setTimeout(() => {
        setImportStatus(null);
        onClose();
      }, 1500);
    } else {
      setImportStatus('Invalid JSON backup format.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6 shadow-2xl text-slate-100">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-400" /> Prover Profile & Sync
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">Avatar Icon</label>
            <div className="grid grid-cols-6 gap-2">
              {AVATARS.map((av) => (
                <button
                  type="button"
                  key={av}
                  onClick={() => setAvatar(av)}
                  className={`p-3 rounded-xl text-xl flex items-center justify-center border transition-all ${
                    avatar === av ? 'bg-indigo-600/20 border-indigo-500 scale-105' : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20"
            >
              Save Profile
            </button>
          </div>
        </form>

        {/* Data Backup & Sync */}
        <div className="border-t border-slate-800 pt-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-200">Cross-Platform Data Sync & Backup</h3>
          <p className="text-xs text-slate-400">Export your proof progress to JSON or import on another device for seamless offline study.</p>

          <div className="flex gap-3">
            <button
              onClick={handleExport}
              className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4 text-indigo-400" /> Export JSON
            </button>
          </div>

          <div className="space-y-2">
            <textarea
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              placeholder="Paste backup JSON here to import progress..."
              rows={3}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono focus:outline-none focus:border-indigo-500"
            />
            <div className="flex items-center justify-between">
              {importStatus && <span className="text-xs text-emerald-400 font-semibold">{importStatus}</span>}
              <button
                onClick={handleImport}
                className="ml-auto py-2 px-4 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/40 text-violet-300 text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                <Upload className="w-4 h-4" /> Import Progress
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
          <span className="text-xs text-slate-500">Reset all curriculum progress</span>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to reset all progress?')) {
                resetProgress();
                onClose();
              }
            }}
            className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Data
          </button>
        </div>
      </div>
    </div>
  );
};
