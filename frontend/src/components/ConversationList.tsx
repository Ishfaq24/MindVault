import React from 'react';
import { Conversation } from '../types';
import { MessageSquare, Plus, Trash2 } from 'lucide-react';
import { formatRelativeTime } from '../utils/formatters';
import { cn } from '../utils/cn';

export interface ConversationListProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
}) => {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-3">
      <button
        onClick={onNew}
        className="w-full flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs transition-colors shadow-2xs mb-3 cursor-pointer"
      >
        <Plus className="w-4 h-4" /> New Conversation
      </button>

      <div className="flex-1 overflow-y-auto space-y-1">
        <div className="px-2 pb-1 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
          Past Chats
        </div>

        {conversations.length === 0 ? (
          <p className="text-xs text-slate-400 p-2 text-center">No history yet</p>
        ) : (
          conversations.map(conv => (
            <div
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              className={cn(
                'group flex items-center justify-between p-2.5 rounded-xl text-xs font-medium cursor-pointer transition-colors',
                conv.id === activeId
                  ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              )}
            >
              <div className="flex items-center gap-2 min-w-0 pr-1">
                <MessageSquare className="w-3.5 h-3.5 shrink-0 opacity-70" />
                <span className="truncate">{conv.title}</span>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] text-slate-400 hidden group-hover:inline">
                  {formatRelativeTime(conv.updatedAt)}
                </span>
                <button
                  onClick={e => onDelete(conv.id, e)}
                  className="p-1 rounded-md hover:bg-rose-100 dark:hover:bg-rose-900/40 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                  title="Delete conversation"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
