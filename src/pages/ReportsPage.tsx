import { useLanguage } from '@/i18n/LanguageContext';
import { DashboardLayout } from '@/components/DashboardLayout';
import { StatusPill } from '@/components/StatusPill';
import { SkeletonTable } from '@/components/SkeletonCard';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function ReportsPage() {
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  const { data: reports, isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reports')
        .select(`*, reporter:reporter_id(full_name), reported:reported_user_id(full_name)`)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const processReport = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('reports')
        .update({ status: 'processed' as any, processed_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast.success(t('reports.processed'));
    },
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="font-display text-2xl font-bold">{t('reports.title')}</h1>

        {isLoading ? (
          <SkeletonTable rows={5} />
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-start p-4 font-semibold">{t('reports.reporter')}</th>
                    <th className="text-start p-4 font-semibold">{t('reports.reported')}</th>
                    <th className="text-start p-4 font-semibold">{t('reports.reason')}</th>
                    <th className="text-start p-4 font-semibold">{t('reports.date')}</th>
                    <th className="text-start p-4 font-semibold">{t('reports.status')}</th>
                    <th className="text-start p-4 font-semibold">{t('users.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {reports?.length === 0 && (
                    <tr><td colSpan={6} className="text-center p-8 text-muted-foreground">{t('common.noData')}</td></tr>
                  )}
                  {reports?.map((report, i) => (
                    <motion.tr
                      key={report.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                    >
                      <td className="p-4">{(report.reporter as any)?.full_name || '—'}</td>
                      <td className="p-4">{(report.reported as any)?.full_name || '—'}</td>
                      <td className="p-4 text-muted-foreground max-w-[200px] truncate">{report.reason}</td>
                      <td className="p-4 text-muted-foreground">{new Date(report.created_at).toLocaleDateString()}</td>
                      <td className="p-4">
                        <StatusPill
                          status={report.status === 'processed' ? 'processed' : 'unprocessed'}
                          label={report.status === 'processed' ? t('reports.processed') : t('reports.unprocessed')}
                        />
                      </td>
                      <td className="p-4">
                        {report.status !== 'processed' && (
                          <Button variant="ghost" size="sm" onClick={() => processReport.mutate(report.id)} className="text-success hover:text-success">
                            <CheckCircle className="h-4 w-4 me-1" /> {t('reports.process')}
                          </Button>
                        )}
                      </td>
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
