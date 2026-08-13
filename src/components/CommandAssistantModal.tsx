import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  X,
  Send,
  Terminal,
  Bot,
  Command,
  ArrowRight,
  ShieldAlert,
  Flame
} from 'lucide-react';
import { ModuleType } from '../types';

interface CommandAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteCommand: (cmd: string) => Promise<string>;
  setCurrentModule: (mod: ModuleType) => void;
  isAmharic: boolean;
}

export const CommandAssistantModal: React.FC<CommandAssistantModalProps> = ({
  isOpen,
  onClose,
  onExecuteCommand,
  setCurrentModule,
  isAmharic
}) => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<
    { sender: 'user' | 'servepoint'; text: string; timestamp: string }[]
  >([
    {
      sender: 'servepoint',
      text: `👋 Welcome to ServePoint – Bella Vista Restaurant Management System!
I’m your complete restaurant brain (Full-Stack ready).

How can I help you today? (Type **help** for all commands)`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, loading]);

  if (!isOpen) return null;

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || loading) return;

    const cmd = inputText.trim();
    setInputText('');

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setHistory((prev) => [...prev, { sender: 'user', text: cmd, timestamp: time }]);
    setLoading(true);

    try {
      const reply = await onExecuteCommand(cmd);
      setHistory((prev) => [
        ...prev,
        {
          sender: 'servepoint',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      setHistory((prev) => [
        ...prev,
        {
          sender: 'servepoint',
          text: '⚠️ Command executed. What would you like to do next?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleShortcutPill = (shortcut: string) => {
    setInputText(shortcut);
  };

  const shortcuts = [
    'help',
    'dashboard',
    'show menu',
    'table 5',
    'new order table 7',
    'bill table 3',
    'low stock',
    'reserve for 4 at 8pm John',
    'staff',
    'settings',
    'አማርኛ'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden flex flex-col h-[580px]">
        {/* Console Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-5 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white font-bold shadow-2xs">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 text-sm">
                  ServePoint Brain
                </span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                  Full-Stack Ready
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Bella Vista Management Command Console
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg bg-slate-100 p-1.5 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Quick Shortcut Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-3 bg-slate-50/50 border-b border-slate-100 no-scrollbar">
          <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1 px-1 flex-shrink-0">
            <Terminal className="h-3 w-3" /> Shortcuts:
          </span>
          {shortcuts.map((sc) => (
            <button
              key={sc}
              onClick={() => handleShortcutPill(sc)}
              className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-[11px] font-mono text-slate-800 hover:border-slate-300 hover:bg-slate-50 whitespace-nowrap transition-colors shadow-2xs font-medium"
            >
              {sc}
            </button>
          ))}
        </div>

        {/* Console Message Stream */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 font-sans text-xs">
          {history.map((h, i) => (
            <div
              key={i}
              className={`flex flex-col ${
                h.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-xl rounded-xl p-4 shadow-xs ${
                  h.sender === 'user'
                    ? 'bg-slate-900 text-white font-medium'
                    : 'bg-slate-50 border border-slate-200 text-slate-800'
                }`}
              >
                <div className={`flex items-center justify-between gap-4 text-[10px] pb-1.5 mb-1.5 border-b ${
                  h.sender === 'user' ? 'border-slate-800 text-slate-300' : 'border-slate-200 text-slate-500'
                }`}>
                  <span className="font-mono font-bold uppercase">
                    {h.sender === 'user' ? 'You (Manager)' : 'ServePoint System'}
                  </span>
                  <span>{h.timestamp}</span>
                </div>
                <div className="whitespace-pre-wrap leading-relaxed font-sans">
                  {h.text}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-slate-600 font-mono text-xs animate-pulse">
              <Bot className="h-4 w-4 text-emerald-600" /> ServePoint is processing command state...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-slate-100 bg-white flex gap-2">
          <input
            type="text"
            placeholder={
              isAmharic
                ? 'ትዕዛዝ ወይም ጥያቄ ያስገቡ (ምሳሌ: table 5, bill, help)...'
                : 'Type any shortcut or request (e.g., table 5, bill table 3, help)...'
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-800 font-mono focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-slate-900 px-5 py-3 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <span>Run</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
