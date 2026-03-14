import { cn } from '@/lib/utils';

interface FarmioLogoProps {
  collapsed?: boolean;
  className?: string;
}

export function FarmioLogo({ collapsed, className }: FarmioLogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
        {/* Leaf shape */}
        <path
          d="M18 4C12 4 6 10 6 18C6 22 8 25 11 27C14 29 17 30 18 32C19 30 22 29 25 27C28 25 30 22 30 18C30 10 24 4 18 4Z"
          fill="hsl(125, 47%, 33%)"
          opacity="0.9"
        />
        {/* Leaf vein */}
        <path
          d="M18 8V28M18 12L13 16M18 16L24 13M18 20L12 22M18 24L23 21"
          stroke="hsl(125, 47%, 55%)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.7"
        />
        {/* Tech circuit dots */}
        <circle cx="13" cy="16" r="1.5" fill="hsl(125, 60%, 70%)" />
        <circle cx="24" cy="13" r="1.5" fill="hsl(125, 60%, 70%)" />
        <circle cx="12" cy="22" r="1.5" fill="hsl(125, 60%, 70%)" />
        <circle cx="23" cy="21" r="1.5" fill="hsl(125, 60%, 70%)" />
      </svg>
      {!collapsed && (
        <span className="font-display text-xl font-bold tracking-tight text-sidebar-foreground">
          Farmio
        </span>
      )}
    </div>
  );
}
