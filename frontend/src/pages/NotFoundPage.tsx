import React from 'react';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center shadow-lg">
        <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4">
          <FileQuestion className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">404 — Page Not Found</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 mb-6">
          The page or document route you are trying to reach does not exist in MindVault.
        </p>
        <Button variant="primary" size="md" onClick={() => navigate('/dashboard')} leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
};
