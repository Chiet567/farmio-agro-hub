import { cn } from '@/lib/utils';

type StatusType = 'active' | 'pending' | 'suspended' | 'banned' | 'approved' | 'rejected' | 'processed' | 'unprocessed';

const statusStyles: Record<StatusType, string> = {
  active: 'bg-success/15 text-success',
  approved: 'bg-success/15 text-success',
  processed: 'bg-success/15 text-success',
  pending: 'bg-warning/15 text-warning',
  unprocessed: 'bg-warning/15 text-warning',
  suspended: 'bg-muted text-muted-foreground',
  banned: 'bg-destructive/15 text-destructive',
  rejected: 'bg-destructive/15 text-destructive',
};

export function StatusPill({ status, label }: { status: StatusType; label: string }) {
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
      statusStyles[status] || statusStyles.pending
    )}>
      {label}
    </span>
  );
}
