import { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { DashboardLayout } from '@/components/DashboardLayout';
import { SkeletonTable } from '@/components/SkeletonCard';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Download, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function LogsPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const { data: logs, isLoading } = useQuery({
    queryKey: ['logs', typeFilter, search],
    queryFn: async () => {
      let query = supabase
        .from('activity_logs')
        .select(`*, profiles:user_id(full_name)`)
        .order('created_at', { ascending: false })
        .limit(100);

      if (typeFilter !== 'all') {
        query = query.eq('log_type', typeFilter as 'login' | 'user_action' | 'admin_action' | 'security');
      }
      if (search) {
        query = query.ilike('action', `%${search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const exportCSV = () => {
    if (!logs?.length) return;
    const rows = ['User,Action,Type,Date', ...logs.map(l =>
      `"${(l.profiles as any)?.full_name || '—'}","${l.action}","${l.log_type}","${new Date(l.created_at).toLocaleString()}"`
    )];
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'activity_logs.csv';
    a.click();
  };

  const typeLabels: Record<string, string> = {
    login: 'Login',
    user_action: 'User Action',
    admin_action: 'Admin Action',
    security: 'Security',
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="font-display text-2xl font-bold">{t('logs.title')}</h1>
          <Button onClick={exportCSV} variant="outline" size="sm">
            <Download className="h-4 w-4 me-1" /> {t('common.export')}
          </Button>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t('common.search')} value={search} onChange={e => setSearch(e.target.value)} className="ps-9" />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('logs.type')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('common.all')}</SelectItem>
              <SelectItem value="login">Login</SelectItem>
              <SelectItem value="user_action">User Action</SelectItem>
              <SelectItem value="admin_action">Admin Action</SelectItem>
              <SelectItem value="security">Security</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <SkeletonTable rows={8} />
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-start p-4 font-semibold">{t('logs.user')}</th>
                    <th className="text-start p-4 font-semibold">{t('logs.action')}</th>
                    <th className="text-start p-4 font-semibold">{t('logs.type')}</th>
                    <th className="text-start p-4 font-semibold">{t('logs.date')}</th>
                  </tr>
                </thead>
                <tbody>
                  {logs?.length === 0 && (
                    <tr><td colSpan={4} className="text-center p-8 text-muted-foreground">{t('common.noData')}</td></tr>
                  )}
                  {logs?.map((log, i) => (
                    <motion.tr
                      key={log.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className={cn(
                        "border-b border-border/50 hover:bg-muted/20 transition-colors",
                        log.log_type === 'security' && "bg-destructive/5"
                      )}
                    >
                      <td className="p-4">{(log.profiles as any)?.full_name || '—'}</td>
                      <td className="p-4 flex items-center gap-2">
                        {log.log_type === 'security' && <AlertTriangle className="h-4 w-4 text-destructive" />}
                        {log.action}
                      </td>
                      <td className="p-4 text-muted-foreground">{typeLabels[log.log_type] || log.log_type}</td>
                      <td className="p-4 text-muted-foreground">{new Date(log.created_at).toLocaleString()}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
