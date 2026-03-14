import { useLanguage } from '@/i18n/LanguageContext';
import { KpiCard } from '@/components/KpiCard';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Users, UserCheck, Package, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { SkeletonCard } from '@/components/SkeletonCard';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const CHART_COLORS = ['hsl(125, 47%, 33%)', 'hsl(125, 35%, 64%)', 'hsl(125, 30%, 55%)', 'hsl(36, 100%, 50%)', 'hsl(0, 70%, 42%)'];

function DashboardContent() {
  const { t } = useLanguage();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [usersRes, activeRes, productsRes, revenueRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('user_roles').select('id', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('total_price'),
      ]);
      const totalRevenue = revenueRes.data?.reduce((sum, o) => sum + Number(o.total_price), 0) || 0;
      return {
        totalUsers: usersRes.count || 0,
        activeUsers: activeRes.count || 0,
        totalProducts: productsRes.count || 0,
        totalRevenue,
      };
    },
  });

  const { data: userGrowth } = useQuery({
    queryKey: ['user-growth'],
    queryFn: async () => {
      const { data } = await supabase.from('profiles').select('created_at').order('created_at');
      if (!data?.length) return [];
      const months: Record<string, number> = {};
      data.forEach(u => {
        const month = new Date(u.created_at).toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
        months[month] = (months[month] || 0) + 1;
      });
      return Object.entries(months).map(([name, users]) => ({ name, users }));
    },
  });

  const { data: categoryData } = useQuery({
    queryKey: ['product-categories'],
    queryFn: async () => {
      const { data } = await supabase.from('products').select('category');
      if (!data?.length) return [];
      const cats: Record<string, number> = {};
      data.forEach(p => {
        const cat = p.category || 'Autre';
        cats[cat] = (cats[cat] || 0) + 1;
      });
      return Object.entries(cats).map(([name, value]) => ({ name, value }));
    },
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <h1 className="font-display text-2xl font-bold text-foreground">{t('dashboard.title')}</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="font-display text-2xl font-bold text-foreground">{t('dashboard.title')}</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <KpiCard title={t('dashboard.totalUsers')} value={stats?.totalUsers || 0} icon={Users} trend={12} index={0} />
          <KpiCard title={t('dashboard.activeUsers')} value={stats?.activeUsers || 0} icon={UserCheck} trend={8} index={1} />
          <KpiCard title={t('dashboard.totalProducts')} value={stats?.totalProducts || 0} icon={Package} trend={15} index={2} />
          <KpiCard title={t('dashboard.totalRevenue')} value={stats?.totalRevenue || 0} suffix=" DA" icon={DollarSign} trend={22} index={3} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6"
          >
            <h2 className="font-display text-lg font-semibold mb-4">{t('dashboard.userGrowth')}</h2>
            {userGrowth?.length ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(128, 20%, 88%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="users" fill="hsl(125, 47%, 33%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-muted-foreground text-sm">{t('common.noData')}</div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-6"
          >
            <h2 className="font-display text-lg font-semibold mb-4">{t('dashboard.productCategories')}</h2>
            {categoryData?.length ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name }) => name}>
                    {categoryData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-muted-foreground text-sm">{t('common.noData')}</div>
            )}
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default DashboardContent;
