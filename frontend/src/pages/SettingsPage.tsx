import React from 'react';
import { SettingsForm } from '../features/settings/SettingsForm';

export const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
          Account Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Manage security options, credentials, and active sessions
        </p>
      </div>

      <SettingsForm />
    </div>
  );
};
