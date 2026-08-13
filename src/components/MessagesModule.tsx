import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Bot,
  User,
  Sparkles,
  Users,
  Utensils,
  Clock
} from 'lucide-react';
import { ChatMessage } from '../types';

interface MessagesModuleProps {
  chatMessages: ChatMessage[];
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  isAmharic: boolean;
  onSendToAiAssistant: (text: string) => Promise<string>;
}

export const MessagesModule: React.FC<MessagesModuleProps> = ({
  chatMessages,
  setChatMessages,
  isAmharic,
  onSendToAiAssistant
}) => {
  const [activeChannel, setActiveChannel] = useState<ChatMessage['channel']>('General');
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const channels: ChatMessage['channel'][] = [
    'General',
    'Kitchen KDS',
    'Front of House',
    'ServePoint AI Manager'
  ];

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: `cm-${Date.now()}`,
      sender: 'Abebe (Manager)',
      text: inputText,
      channel: activeChannel,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, userMsg]);
    const promptText = inputText;
    setInputText('');

    if (activeChannel === 'ServePoint AI Manager') {
      setIsTyping(true);
      const aiReply = await onSendToAiAssistant(promptText);
      setIsTyping(false);

      const aiMsg: ChatMessage = {
        id: `cm-ai-${Date.now()}`,
        sender: 'ServePoint AI Manager',
        text: aiReply,
        channel: 'ServePoint AI Manager',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAi: true
      };
      setChatMessages((prev) => [...prev, aiMsg]);
    }
  };

  const filteredMessages = chatMessages.filter((m) => m.channel === activeChannel);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">
          {isAmharic ? 'የቤላ ቪስታ የውስጥ መልእክት' : 'Internal Team & AI Chat'}
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          {isAmharic
            ? 'በወጥ ቤት፣ በግንባር አገልጋዮች እና በServePoint AI መካከል የቀጥታ መልእክቶች'
            : 'Communication channels between Kitchen, Front of House & ServePoint AI Manager.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[600px]">
        {/* Left Channels (4 cols) */}
        <div className="lg:col-span-4 rounded-xl border border-slate-200 bg-white p-4 space-y-2 shadow-xs">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-2">
            Team Channels
          </h3>

          {channels.map((ch) => (
            <button
              key={ch}
              onClick={() => setActiveChannel(ch)}
              className={`w-full flex items-center justify-between p-3 rounded-lg text-xs transition-all ${
                activeChannel === ch
                  ? 'bg-slate-900 text-white font-bold shadow-2xs'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 font-medium'
              }`}
            >
              <div className="flex items-center gap-2">
                {ch === 'ServePoint AI Manager' ? (
                  <Bot className={`h-4 w-4 ${activeChannel === ch ? 'text-amber-400' : 'text-slate-500'}`} />
                ) : (
                  <MessageSquare className="h-4 w-4" />
                )}
                <span>{ch}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Right Chat Stream (8 cols) */}
        <div className="lg:col-span-8 rounded-xl border border-slate-200 bg-white p-5 flex flex-col justify-between h-full shadow-xs">
          {/* Header */}
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <span className="font-bold text-slate-800 text-sm">{activeChannel} Channel</span>
            {activeChannel === 'ServePoint AI Manager' && (
              <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-amber-500" /> Full-Stack AI
              </span>
            )}
          </div>

          {/* Messages Log */}
          <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-2">
            {filteredMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.isAi ? 'items-start' : 'items-end'
                }`}
              >
                <div
                  className={`max-w-xl p-3.5 rounded-xl text-xs space-y-1 ${
                    msg.isAi
                      ? 'bg-slate-50 border border-slate-200 text-slate-800'
                      : 'bg-slate-900 text-white font-medium shadow-2xs'
                  }`}
                >
                  <div className={`flex items-center justify-between gap-4 text-[10px] pb-1 border-b ${
                    msg.isAi ? 'border-slate-200 text-slate-500' : 'border-slate-800 text-slate-300'
                  }`}>
                    <span className="font-bold">{msg.sender}</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="text-xs text-slate-600 animate-pulse flex items-center gap-2 font-medium">
                <Bot className="h-4 w-4 text-emerald-600" /> ServePoint AI is typing response...
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-100 flex gap-2">
            <input
              type="text"
              placeholder={
                activeChannel === 'ServePoint AI Manager'
                  ? 'Ask ServePoint AI or give command (e.g. low stock, bill table 3)...'
                  : 'Type channel message...'
              }
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 flex items-center gap-1 shadow-2xs"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
