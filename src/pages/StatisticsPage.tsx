import { useLanguage } from '@/i18n/LanguageContext';
import { DashboardLayout } from '@/components/DashboardLayout';
import { KpiCard } from '@/components/KpiCard';
import { SkeletonCard } from '@/components/SkeletonCard';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Users, UserCheck, Package, DollarSign, TrendingUp, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function StatisticsPage() {
  const { t } = useLanguage();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['statistics'],
    queryFn: async () => {
      const [usersRes, activeRes, productsRes, ordersRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('user_roles').select('id', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('total_price'),
      ]);
      const revenue = ordersRes.data?.reduce((s, o) => s + Number(o.total_price), 0) || 0;
      return {
        totalUsers: usersRes.count || 0,
        activeUsers: activeRes.count || 0,
        totalProducts: productsRes.count || 0,
        totalRevenue: revenue,
        totalOrders: ordersRes.data?.length || 0,
      };
    },
  });

  const { data: revenueData } = useQuery({
    queryKey: ['revenue-chart'],
    queryFn: async () => {
      const { data } = await supabase.from('orders').select('total_price, created_at').order('created_at');
      if (!data?.length) return [];
      const months: Record<string, number> = {};
      data.forEach(o => {
        const m = new Date(o.created_at).toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
        months[m] = (months[m] || 0) + Number(o.total_price);
      });
      return Object.entries(months).map(([name, revenue]) => ({ name, revenue }));
    },
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="font-display text-2xl font-bold">{t('nav.statistics')}</h1>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <KpiCard title={t('dashboard.totalUsers')} value={stats?.totalUsers || 0} icon={Users} trend={12} index={0} />
              <KpiCard title={t('dashboard.activeUsers')} value={stats?.activeUsers || 0} icon={UserCheck} trend={8} index={1} />
              <KpiCard title={t('dashboard.totalProducts')} value={stats?.totalProducts || 0} icon={Package} trend={15} index={2} />
              <KpiCard title={t('dashboard.totalRevenue')} value={stats?.totalRevenue || 0} suffix=" DA" icon={DollarSign} trend={22} index={3} />
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6">
              <h2 className="font-display text-lg font-semibold mb-4">{t('dashboard.totalRevenue')}</h2>
              {revenueData?.length ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(128, 20%, 88%)" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value: number) => `${value.toLocaleString()} DA`} />
                    <Line type="monotone" dataKey="revenue" stroke="hsl(125, 47%, 33%)" strokeWidth={2.5} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">{t('common.noData')}</div>
              )}
            </motion.div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
