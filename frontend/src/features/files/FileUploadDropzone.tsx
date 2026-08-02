import React, { useState, useRef } from 'react';
import { UploadProgressItem } from '../../types';
import { uploadService } from '../../services/uploadService';
import { UploadCard } from '../../components/UploadCard';
import { Button } from '../../components/Button';
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE_BYTES } from '../../constants';
import { formatBytes } from '../../utils/formatters';
import { UploadCloud, FilePlus, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export interface FileUploadDropzoneProps {
  onUploadComplete?: () => void;
}

export const FileUploadDropzone: React.FC<FileUploadDropzoneProps> = ({ onUploadComplete }) => {
  const [items, setItems] = useState<UploadProgressItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return `File exceeds maximum size limit of ${formatBytes(MAX_FILE_SIZE_BYTES)}`;
    }
    // Accept by extension too because some browsers report Markdown as plain text or octet-stream.
    const ext = file.name.split('.').pop()?.toLowerCase();
    const allowedExts = ['pdf', 'docx', 'txt', 'md', 'markdown'];
    if (!ACCEPTED_FILE_TYPES.includes(file.type) && (!ext || !allowedExts.includes(ext))) {
      return `Unsupported file format (.${ext}). Supported: PDF, DOCX, TXT, and Markdown.`;
    }
    return null;
  };

  const startUpload = (item: UploadProgressItem) => {
    const controller = new AbortController();

    setItems(prev =>
      prev.map(i => (i.id === item.id ? { ...i, status: 'uploading', progress: 0, abortController: controller } : i))
    );

    uploadService
      .uploadFile(
        item.file,
        percent => {
          setItems(prev =>
            prev.map(i => (i.id === item.id ? { ...i, progress: percent } : i))
          );
        },
        controller.signal
      )
      .then(res => {
        setItems(prev =>
          prev.map(i => (i.id === item.id ? { ...i, status: 'completed', progress: 100, res } : i))
        );
        toast.success(`Uploaded ${item.file.name}`);
        onUploadComplete?.();
      })
      .catch(err => {
        if (err.name === 'CanceledError' || err.message?.includes('canceled')) {
          setItems(prev =>
            prev.map(i => (i.id === item.id ? { ...i, status: 'cancelled', error: 'Upload cancelled by user' } : i))
          );
        } else {
          const message =
            err.response?.data?.message ||
            err.message ||
            'Upload failed';

          setItems(prev =>
            prev.map(i => (i.id === item.id ? { ...i, status: 'error', error: message } : i))
          );
          toast.error(message);
        }
      });
  };

  const handleFiles = (fileList: FileList | File[]) => {
    const newItems: UploadProgressItem[] = [];

    Array.from(fileList).forEach(file => {
      const error = validateFile(file);
      const id = `up_${crypto.randomUUID()}`;

      if (error) {
        toast.error(`${file.name}: ${error}`);
        newItems.push({
          id,
          file,
          progress: 0,
          status: 'error',
          error,
        });
      } else {
        const newItem: UploadProgressItem = {
          id,
          file,
          progress: 0,
          status: 'pending',
        };
        newItems.push(newItem);
      }
    });

    setItems(prev => [...newItems, ...prev]);

    // Start upload for valid pending items
    newItems.forEach(item => {
      if (item.status === 'pending') {
        startUpload(item);
      }
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleCancel = (id: string) => {
    const item = items.find(i => i.id === id);
    if (item?.abortController) {
      item.abortController.abort();
    }
  };

  const handleRetry = (item: UploadProgressItem) => {
    startUpload(item);
  };

  return (
    <div className="space-y-6">
      {/* Dropzone Container */}
      <div
        onDragOver={e => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center p-8 sm:p-12 rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer text-center ${
          isDragging
            ? 'border-sky-500 bg-sky-50/80 dark:bg-sky-950/40 scale-[1.01]'
            : 'border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-sky-400 dark:hover:border-sky-700 hover:bg-slate-50/50 dark:hover:bg-slate-900/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={e => {
            if (e.target.files) handleFiles(e.target.files);
          }}
        />

        <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 mb-4 shadow-xs">
          <UploadCloud className="w-8 h-8" />
        </div>

        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
          Drag & drop knowledge files here
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md">
          Supports PDF, DOCX, TXT, and Markdown up to {formatBytes(MAX_FILE_SIZE_BYTES)}
        </p>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-5"
          leftIcon={<FilePlus className="w-4 h-4" />}
          onClick={e => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
        >
          Select Files from Device
        </Button>
      </div>

      {/* Progress Cards */}
      {items.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>Upload Queue ({items.length})</span>
            <button
              onClick={() => setItems([])}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Clear Queue
            </button>
          </div>

          <div className="grid gap-3">
            {items.map(item => (
              <UploadCard key={item.id} item={item} onCancel={handleCancel} onRetry={handleRetry} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
