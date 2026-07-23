import React, { useState, useMemo } from 'react';
import { FileMeta, FileStatus } from '../../types';
import { FileCard } from '../../components/FileCard';
import { StatusBadge } from '../../components/StatusBadge';
import { Pagination } from '../../components/Pagination';
import { EmptyState } from '../../components/EmptyState';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { formatBytes, formatDate } from '../../utils/formatters';
import {
  LayoutGrid,
  List,
  Search,
  ArrowUpDown,
  Download,
  Trash2,
  Eye,
  Edit2,
  FileText,
} from 'lucide-react';
import { uploadService } from '../../services/uploadService';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export interface FileListTableProps {
  files: FileMeta[];
  onRefetch: () => void;
  isLoading?: boolean;
}

type SortField = 'filename' | 'size' | 'status' | 'createdAt' | 'updatedAt';

export const FileListTable: React.FC<FileListTableProps> = ({ files, onRefetch, isLoading }) => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modals state
  const [deletingFile, setDeletingFile] = useState<FileMeta | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [renamingFile, setRenamingFile] = useState<FileMeta | null>(null);
  const [newFilename, setNewFilename] = useState('');
  const [isRenaming, setIsRenaming] = useState(false);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const filteredAndSortedFiles = useMemo(() => {
    return files
      .filter(f => {
        const matchesSearch =
          f.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
          f.originalName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || f.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        let valA: any = a[sortField];
        let valB: any = b[sortField];
        if (sortField === 'createdAt' || sortField === 'updatedAt') {
          valA = new Date(valA).getTime();
          valB = new Date(valB).getTime();
        }
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [files, searchTerm, statusFilter, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedFiles.length / pageSize) || 1;
  const paginatedFiles = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedFiles.slice(start, start + pageSize);
  }, [filteredAndSortedFiles, currentPage, pageSize]);

  const handleDelete = async () => {
    if (!deletingFile) return;
    setIsDeleting(true);
    try {
      await uploadService.deleteUpload(deletingFile.id);
      toast.success('Document deleted successfully');
      setDeletingFile(null);
      onRefetch();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete file');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRename = async () => {
    if (!renamingFile || !newFilename.trim()) return;
    setIsRenaming(true);
    try {
      await uploadService.updateUpload(renamingFile.id, { filename: newFilename.trim() });
      toast.success('File renamed');
      setRenamingFile(null);
      onRefetch();
    } catch (err: any) {
      toast.error(err.message || 'Failed to rename file');
    } finally {
      setIsRenaming(false);
    }
  };

  const handleDownload = (file: FileMeta) => {
    uploadService
      .downloadFile(file.id, file.originalName)
      .then(() => toast.success('Download started'))
      .catch(() => toast.error('Download failed'));
  };

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search documents..."
              className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            />
          </div>

          <select
            value={statusFilter}
            onChange={e => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="READY">READY</option>
            <option value="FAILED">FAILED</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
              viewMode === 'table'
                ? 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
              viewMode === 'grid'
                ? 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {paginatedFiles.length === 0 ? (
        <EmptyState
          title="No Knowledge Documents Found"
          description={
            searchTerm || statusFilter !== 'ALL'
              ? 'No files match your search criteria or filter options.'
              : 'Start populating your MindVault OS by uploading your first document.'
          }
          actionLabel="Upload New Document"
          onAction={() => navigate('/upload')}
        />
      ) : viewMode === 'table' ? (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th
                  className="p-3.5 cursor-pointer hover:text-slate-900 dark:hover:text-slate-200"
                  onClick={() => handleSort('filename')}
                >
                  <div className="flex items-center gap-1">
                    Filename <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-3.5">Original Name</th>
                <th
                  className="p-3.5 cursor-pointer hover:text-slate-900 dark:hover:text-slate-200"
                  onClick={() => handleSort('size')}
                >
                  <div className="flex items-center gap-1">
                    Size <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  className="p-3.5 cursor-pointer hover:text-slate-900 dark:hover:text-slate-200"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-1">
                    Status <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  className="p-3.5 cursor-pointer hover:text-slate-900 dark:hover:text-slate-200"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center gap-1">
                    Created <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {paginatedFiles.map(file => (
                <tr key={file.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                      <span className="truncate max-w-[180px]">{file.filename}</span>
                    </div>
                  </td>
                  <td className="p-3.5 text-slate-500 dark:text-slate-400 truncate max-w-[160px]">
                    {file.originalName}
                  </td>
                  <td className="p-3.5 font-medium">{formatBytes(file.size)}</td>
                  <td className="p-3.5">
                    <StatusBadge status={file.status} />
                  </td>
                  <td className="p-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {formatDate(file.createdAt)}
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => navigate(`/files/${file.id}`)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setRenamingFile(file);
                          setNewFilename(file.filename);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Rename"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownload(file)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingFile(file)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginatedFiles.map(file => (
            <FileCard
              key={file.id}
              file={file}
              onView={() => navigate(`/files/${file.id}`)}
              onDownload={handleDownload}
              onDelete={() => setDeletingFile(file)}
            />
          ))}
        </div>
      )}

      {/* Pagination Footer */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredAndSortedFiles.length}
        pageSize={pageSize}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!deletingFile}
        onClose={() => setDeletingFile(null)}
        onConfirm={handleDelete}
        title="Delete Document"
        message={`Are you sure you want to permanently remove "${deletingFile?.filename}" from your MindVault Knowledge Base? This action cannot be undone.`}
        confirmLabel="Delete Document"
        isLoading={isDeleting}
      />

      {/* Rename Modal */}
      <Modal
        isOpen={!!renamingFile}
        onClose={() => setRenamingFile(null)}
        title="Rename Document"
      >
        <div className="space-y-4 my-2">
          <Input
            label="Filename"
            value={newFilename}
            onChange={e => setNewFilename(e.target.value)}
            placeholder="document_name.pdf"
          />
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={() => setRenamingFile(null)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={handleRename}
              disabled={isRenaming || !newFilename.trim()}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 disabled:opacity-50"
            >
              {isRenaming ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
