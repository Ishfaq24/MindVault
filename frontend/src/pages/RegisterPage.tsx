import React from 'react';
import { RegisterForm } from '../features/auth/RegisterForm';
import { BrainCircuit } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
        <div className="flex flex-col items-center text-center mb-8">
          <Link to="/" className="p-3 rounded-2xl bg-sky-600 text-white shadow-lg shadow-sky-600/20 mb-3">
            <BrainCircuit className="w-7 h-7" />
          </Link>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">Create MindVault Account</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Start building your AI-powered Knowledge OS</p>
        </div>

        <RegisterForm />
      </div>
    </div>
  );
};
