import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  UploadCloud,
  FolderKanban,
  Search,
  MessageSquareText,
  Settings,
  BrainCircuit,
  Sparkles,
} from 'lucide-react';
import { cn } from '../utils/cn';

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onMobileClose }) => {
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Upload Files', path: '/upload', icon: <UploadCloud className="w-4 h-4" /> },
    { label: 'My Knowledge', path: '/files', icon: <FolderKanban className="w-4 h-4" /> },
    { label: 'Semantic Search', path: '/search', icon: <Search className="w-4 h-4" /> },
    { label: 'AI Chat RAG', path: '/chat', icon: <MessageSquareText className="w-4 h-4" /> },
    { label: 'Settings', path: '/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 bottom-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-200 lg:translate-x-0',
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-200 dark:border-slate-800">
          <div className="p-2 rounded-xl bg-sky-600 text-white shadow-md shadow-sky-600/20">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              MindVault
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300 font-bold">
                OS
              </span>
            </span>
            <span className="text-[10px] text-slate-500 font-medium">Knowledge Engine</span>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
            Platform Navigation
          </div>

          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onMobileClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group cursor-pointer',
                  isActive
                    ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 shadow-2xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      'transition-colors',
                      isActive
                        ? 'text-sky-600 dark:text-sky-400'
                        : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                    )}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Footer Feature Card */}
        <div className="p-4 m-3 rounded-2xl bg-gradient-to-br from-sky-500/10 via-blue-500/10 to-sky-600/10 border border-sky-200/60 dark:border-sky-800/50">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Gemini RAG Engine
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
            Vector indexing, semantic search, and document reasoning ready.
          </p>
        </div>
      </aside>
    </>
  );
};
