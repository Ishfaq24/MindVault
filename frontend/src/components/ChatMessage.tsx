import React, { useState } from 'react';
import { ChatMessageItem } from '../types';
import { Avatar } from './Avatar';
import { BrainCircuit, Copy, Check, FileText, Quote } from 'lucide-react';
import { formatRelativeTime } from '../utils/formatters';
import toast from 'react-hot-toast';

export interface ChatMessageProps {
  message: ChatMessageItem;
  userName?: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, userName = 'You' }) => {
  const [copied, setCopied] = useState(false);
  const isAssistant = message.role === 'assistant';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex gap-3 my-4 ${isAssistant ? 'items-start' : 'items-start flex-row-reverse'}`}>
      {isAssistant ? (
        <div className="p-2 rounded-xl bg-sky-600 text-white shrink-0 shadow-md shadow-sky-600/20 mt-0.5">
          <BrainCircuit className="w-4 h-4" />
        </div>
      ) : (
        <Avatar name={userName} size="sm" className="mt-0.5" />
      )}

      <div className={`flex flex-col max-w-2xl ${isAssistant ? 'items-start' : 'items-end'}`}>
        <div className="flex items-center gap-2 mb-1 px-1">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {isAssistant ? 'MindVault Assistant' : userName}
          </span>
          <span className="text-[10px] text-slate-400">{formatRelativeTime(message.timestamp)}</span>
        </div>

        <div
          className={`relative p-4 rounded-2xl text-xs leading-relaxed shadow-2xs ${
            isAssistant
              ? 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-xs'
              : 'bg-sky-600 text-white rounded-tr-xs'
          }`}
        >
          {message.isThinking ? (
            <div className="flex items-center gap-2 py-1 text-slate-500 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
              <span>Analyzing knowledge base & generating answer...</span>
            </div>
          ) : (
            <div className="whitespace-pre-wrap font-sans">{message.content}</div>
          )}

          {/* Copy button */}
          {isAssistant && !message.isThinking && (
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Copy message"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}

          {/* Citations / Sources */}
          {isAssistant && message.sources && message.sources.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                <Quote className="w-3 h-3 text-sky-500" />
                <span>Knowledge Base Sources ({message.sources.length})</span>
              </div>
              <div className="grid gap-2">
                {message.sources.map((source, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800 text-[11px]"
                  >
                    <div className="flex items-center gap-1.5 font-bold text-sky-600 dark:text-sky-400 mb-1">
                      <FileText className="w-3 h-3" />
                      <span>{source.filename}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 italic line-clamp-3">
                      "{source.chunk}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
