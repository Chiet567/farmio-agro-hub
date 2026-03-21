import { type LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  suffix?: string;
  trend?: number;
  index?: number;
}

export function KpiCard({ title, value, icon, trend }: KpiCardProps) {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      {trend && (
        <p className={`text-xs ${trend > 0 ? 'text-green-600' : 'text-red-600'} mt-2`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </p>
      )}
    </div>
  );
}
