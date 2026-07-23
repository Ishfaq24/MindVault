import React, { useState, useEffect } from 'react';
import { FileListTable } from '../features/files/FileListTable';
import { fileService } from '../services/fileService';
import { FileMeta } from '../types';
import { Button } from '../components/Button';
import { Plus, RefreshCw, FolderKanban } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const FilesPage: React.FC = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<FileMeta[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFiles = () => {
    setIsLoading(true);
    fileService
      .getMyFiles()
      .then(res => {
        setFiles(res);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            My Knowledge Base
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage, filter, rename, and review indexed documents in your personal OS
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchFiles}
            isLoading={isLoading}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/upload')}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Upload File
          </Button>
        </div>
      </div>

      <FileListTable files={files} onRefetch={fetchFiles} isLoading={isLoading} />
    </div>
  );
};
