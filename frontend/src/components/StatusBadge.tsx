import React from 'react';
import { FileStatus } from '../types';
import { Badge } from './Badge';
import { getStatusBadgeVariant } from '../utils/formatters';
import { Clock, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export interface StatusBadgeProps {
  status: FileStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const variant = getStatusBadgeVariant(status);

  const getIcon = () => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-3 h-3 text-amber-500 animate-pulse" />;
      case 'PROCESSING':
        return <Loader2 className="w-3 h-3 text-indigo-500 animate-spin" />;
      case 'READY':
      case 'PROCESSED':
        return <CheckCircle2 className="w-3 h-3 text-emerald-500" />;
      case 'FAILED':
        return <AlertCircle className="w-3 h-3 text-rose-500" />;
      default:
        return null;
    }
  };

  return (
    <Badge variant={variant} size="sm">
      {getIcon()}
      <span>{status}</span>
    </Badge>
  );
};
