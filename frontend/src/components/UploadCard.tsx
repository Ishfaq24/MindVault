import React from 'react';
import { UploadProgressItem } from '../types';
import { formatBytes } from '../utils/formatters';
import { FileText, CheckCircle2, AlertCircle, X, RotateCcw } from 'lucide-react';

export interface UploadCardProps {
  item: UploadProgressItem;
  onCancel: (id: string) => void;
  onRetry: (item: UploadProgressItem) => void;
}

export const UploadCard: React.FC<UploadCardProps> = ({ item, onCancel, onRetry }) => {
  return (
    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
              {item.file.name}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {formatBytes(item.file.size)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {item.status === 'completed' && (
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> Done
            </span>
          )}

          {item.status === 'error' && (
            <div className="flex items-center gap-1">
              <span className="flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
                <AlertCircle className="w-4 h-4" /> Failed
              </span>
              <button
                onClick={() => onRetry(item)}
                className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                title="Retry upload"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {item.status === 'uploading' && (
            <button
              onClick={() => onCancel(item.id)}
              className="p-1 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Cancel upload"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {item.status === 'uploading' && (
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden mt-1">
          <div
            className="bg-indigo-600 dark:bg-indigo-500 h-1.5 rounded-full transition-all duration-200"
            style={{ width: `${item.progress}%` }}
          />
        </div>
      )}

      {item.error && (
        <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400 mt-1">
          {item.error}
        </p>
      )}
    </div>
  );
};
