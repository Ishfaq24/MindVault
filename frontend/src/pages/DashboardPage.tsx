import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { fileService } from '../services/fileService';
import { FileMeta } from '../types';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { StatusBadge } from '../components/StatusBadge';
import { Skeleton } from '../components/Skeleton';
import { EmptyState } from '../components/EmptyState';
import { formatBytes, formatDate } from '../utils/formatters';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Search,
  MessageSquareText,
  Plus,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [files, setFiles] = useState<FileMeta[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fileService
      .getMyFiles()
      .then(res => {
        if (isMounted) {
          setFiles(res);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const totalFiles = files.length;
  const processedCount = files.filter(f => f.status === 'READY' || f.status === 'PROCESSED').length;
  const processingCount = files.filter(f => f.status === 'PROCESSING' || f.status === 'PENDING').length;
  const failedCount = files.filter(f => f.status === 'FAILED').length;
  const recentFiles = files.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-sky-500 via-blue-600 to-sky-700 text-white shadow-lg shadow-sky-500/15 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sparkles className="w-48 h-48" />
        </div>
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold text-white">
            <Sparkles className="w-3.5 h-3.5 text-sky-200" /> MindVault Knowledge OS
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {user?.name || 'Knowledge Architect'}
          </h1>
          <p className="text-xs sm:text-sm text-sky-50 leading-relaxed">
            Your personal knowledge database is active. You have {totalFiles} documents stored and indexed for RAG queries.
          </p>

          <div className="flex flex-wrap gap-3 pt-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/upload')}
              className="bg-white text-sky-700 hover:bg-sky-50 font-bold border-none"
              leftIcon={<Plus className="w-4 h-4 text-sky-600" />}
            >
              Upload Document
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/chat')}
              className="text-white hover:bg-white/15 font-semibold"
              leftIcon={<MessageSquareText className="w-4 h-4" />}
            >
              Ask AI Assistant
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Total Files</p>
            {isLoading ? (
              <Skeleton width={60} height={24} className="mt-1" />
            ) : (
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">{totalFiles}</h3>
            )}
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Indexed & Processed</p>
            {isLoading ? (
              <Skeleton width={60} height={24} className="mt-1" />
            ) : (
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">{processedCount}</h3>
            )}
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Processing Queue</p>
            {isLoading ? (
              <Skeleton width={60} height={24} className="mt-1" />
            ) : (
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">{processingCount}</h3>
            )}
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Failed Items</p>
            {isLoading ? (
              <Skeleton width={60} height={24} className="mt-1" />
            ) : (
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">{failedCount}</h3>
            )}
          </div>
        </Card>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Files Table Card */}
        <Card className="lg:col-span-2 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <FileText className="w-5 h-5 text-sky-600" /> Recent Documents
              </h3>
              <Button variant="ghost" size="sm" onClick={() => navigate('/files')} rightIcon={<ArrowRight className="w-4 h-4" />}>
                View All Files
              </Button>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} width="100%" height={40} />
                ))}
              </div>
            ) : recentFiles.length === 0 ? (
              <EmptyState
                title="No Documents Uploaded"
                description="Your MindVault knowledge base is currently empty. Upload files to get started."
                actionLabel="Upload First File"
                onAction={() => navigate('/upload')}
              />
            ) : (
              <div className="space-y-2">
                {recentFiles.map(file => (
                  <div
                    key={file.id}
                    onClick={() => navigate(`/files/${file.id}`)}
                    className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-sky-200 dark:hover:border-sky-800 bg-slate-50/50 dark:bg-slate-950/50 flex items-center justify-between gap-3 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                          {file.filename}
                        </p>
                        <p className="text-[10px] text-slate-500">{formatBytes(file.size)} • {formatDate(file.createdAt)}</p>
                      </div>
                    </div>

                    <StatusBadge status={file.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Quick Actions & User Card */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Quick Shortcuts</h3>
            <div className="grid gap-2.5">
              <button
                onClick={() => navigate('/upload')}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-sky-50 dark:hover:bg-sky-950/50 hover:border-sky-300 dark:hover:border-sky-800 text-left flex items-center gap-3 transition-colors cursor-pointer group"
              >
                <div className="p-2 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                  <UploadCloud className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Upload Documents</p>
                  <p className="text-[10px] text-slate-500">Add PDF, Markdown, or Office files</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/search')}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-sky-50 dark:hover:bg-sky-950/50 hover:border-sky-300 dark:hover:border-sky-800 text-left flex items-center gap-3 transition-colors cursor-pointer group"
              >
                <div className="p-2 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                  <Search className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Semantic Search</p>
                  <p className="text-[10px] text-slate-500">Query concepts with similarity scores</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/chat')}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-sky-50 dark:hover:bg-sky-950/50 hover:border-sky-300 dark:hover:border-sky-800 text-left flex items-center gap-3 transition-colors cursor-pointer group"
              >
                <div className="p-2 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                  <MessageSquareText className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">AI Chat RAG</p>
                  <p className="text-[10px] text-slate-500">Chat grounded in document citations</p>
                </div>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
