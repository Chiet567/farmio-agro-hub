import { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { DashboardLayout } from '@/components/DashboardLayout';
import { StatusPill } from '@/components/StatusPill';
import { SkeletonTable } from '@/components/SkeletonCard';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Check, X, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function ProductsPage() {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select(`*, profiles:farmer_id(full_name)`)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const updateProduct = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('products')
        .update({ status: status as any })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(t('common.save'));
    },
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(t('products.delete'));
    },
  });

  const statusLabels: Record<string, string> = {
    pending: t('products.pending'),
    approved: t('products.approved'),
    rejected: t('products.rejected'),
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="font-display text-2xl font-bold">{t('products.title')}</h1>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('common.all')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('common.all')}</SelectItem>
              <SelectItem value="pending">{t('products.pending')}</SelectItem>
              <SelectItem value="approved">{t('products.approved')}</SelectItem>
              <SelectItem value="rejected">{t('products.rejected')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <SkeletonTable rows={5} />
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-start p-4 font-semibold">{t('products.name')}</th>
                    <th className="text-start p-4 font-semibold">{t('products.farmer')}</th>
                    <th className="text-start p-4 font-semibold">{t('products.price')}</th>
                    <th className="text-start p-4 font-semibold">{t('products.quantity')}</th>
                    <th className="text-start p-4 font-semibold">{t('products.status')}</th>
                    <th className="text-start p-4 font-semibold">{t('products.date')}</th>
                    <th className="text-start p-4 font-semibold">{t('users.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {products?.length === 0 && (
                    <tr><td colSpan={7} className="text-center p-8 text-muted-foreground">{t('common.noData')}</td></tr>
                  )}
                  {products?.map((product, i) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                    >
                      <td className="p-4 font-medium">{product.name}</td>
                      <td className="p-4 text-muted-foreground">{(product.profiles as any)?.full_name || '—'}</td>
                      <td className="p-4">{Number(product.price).toLocaleString()} DA</td>
                      <td className="p-4">{product.quantity}</td>
                      <td className="p-4">
                        <StatusPill status={product.status as any} label={statusLabels[product.status] || product.status} />
                      </td>
                      <td className="p-4 text-muted-foreground">{new Date(product.created_at).toLocaleDateString()}</td>
                      <td className="p-4">
                        <div className="flex gap-1">
                          {product.status === 'pending' && (
                            <>
                              <Button variant="ghost" size="icon" onClick={() => updateProduct.mutate({ id: product.id, status: 'approved' })} className="text-success hover:text-success">
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => updateProduct.mutate({ id: product.id, status: 'rejected' })} className="text-destructive hover:text-destructive">
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button variant="ghost" size="icon" onClick={() => deleteProduct.mutate(product.id)} className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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
