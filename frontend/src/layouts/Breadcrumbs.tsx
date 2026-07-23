import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const pathNameMap: Record<string, string> = {
  dashboard: 'Dashboard',
  upload: 'Upload Documents',
  files: 'My Knowledge Base',
  search: 'Semantic Search',
  chat: 'AI Assistant Chat',
  settings: 'Account Settings',
  unauthorized: 'Unauthorized',
};

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  if (pathnames.length === 0) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
        <Home className="w-3.5 h-3.5 text-slate-400" />
        <span>/</span>
        <span className="text-slate-900 dark:text-slate-100 font-semibold">Dashboard</span>
      </div>
    );
  }

  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
      <Link
        to="/dashboard"
        className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors flex items-center gap-1"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayName = pathNameMap[value] || (value.length > 12 ? `${value.slice(0, 10)}...` : value);

        return (
          <React.Fragment key={to}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            {isLast ? (
              <span className="text-slate-900 dark:text-slate-100 font-semibold">{displayName}</span>
            ) : (
              <Link to={to} className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
