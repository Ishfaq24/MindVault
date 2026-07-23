import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
}) => {
  if (totalPages <= 1) return null;

  const startItem = totalItems && pageSize ? (currentPage - 1) * pageSize + 1 : undefined;
  const endItem =
    totalItems && pageSize ? Math.min(currentPage * pageSize, totalItems) : undefined;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
      <div>
        {startItem && endItem && totalItems ? (
          <span>
            Showing <strong className="text-slate-700 dark:text-slate-200">{startItem}</strong> to{' '}
            <strong className="text-slate-700 dark:text-slate-200">{endItem}</strong> of{' '}
            <strong className="text-slate-700 dark:text-slate-200">{totalItems}</strong> entries
          </span>
        ) : (
          <span>
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
        >
          Previous
        </Button>
        <span className="px-2 font-medium text-slate-700 dark:text-slate-300">
          {currentPage} / {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
