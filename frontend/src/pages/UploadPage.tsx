import React from 'react';
import { FileUploadDropzone } from '../features/files/FileUploadDropzone';
import { Card } from '../components/Card';
import { Sparkles } from 'lucide-react';

export const UploadPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          Ingest Knowledge Documents
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Upload PDF, Word, Markdown, or image files to automatically parse and index into MindVault's neural vector store.
        </p>
      </div>

      <FileUploadDropzone />
    </div>
  );
};
