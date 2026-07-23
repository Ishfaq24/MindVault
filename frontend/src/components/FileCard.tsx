import React from 'react';
import { FileMeta } from '../types';
import { Card } from './Card';
import { StatusBadge } from './StatusBadge';
import { formatBytes, formatDate } from '../utils/formatters';
import { FileText, Download, Trash2, Eye } from 'lucide-react';

export interface FileCardProps {
  file: FileMeta;
  onView?: (file: FileMeta) => void;
  onDownload?: (file: FileMeta) => void;
  onDelete?: (file: FileMeta) => void;
}

export const FileCard: React.FC<FileCardProps> = ({ file, onView, onDownload, onDelete }) => {
  return (
    <Card hoverable className="flex flex-col justify-between gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 shrink-0">
          <FileText className="w-5 h-5" />
        </div>
        <StatusBadge status={file.status} />
      </div>

      <div>
        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate" title={file.filename}>
          {file.filename}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5" title={file.originalName}>
          {file.originalName}
        </p>
        <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <span>{formatBytes(file.size)}</span>
          <span>{formatDate(file.createdAt)}</span>
        </div>
      </div>

      <div className="flex items-center justify-end gap-1.5 pt-1">
        {onView && (
          <button
            onClick={() => onView(file)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
        )}
        {onDownload && (
          <button
            onClick={() => onDownload(file)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Download File"
          >
            <Download className="w-4 h-4" />
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(file)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
            title="Delete File"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </Card>
  );
};
