import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface KpiCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: number;
}

export function KpiCard({ title, value, icon, trend }: KpiCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    // Animate card entrance
    if (cardRef.current) {
      gsap.fromTo(cardRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
    }
  }, []);

  return (
    <div ref={cardRef} className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </div>
      <div className="text-2xl font-bold">
        <span ref={numberRef}>{value}</span>
      </div>
      {trend && (
        <p className={`text-xs ${trend > 0 ? 'text-green-600' : 'text-red-600'} mt-2`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
        </p>
      )}
    </div>
  );
}
