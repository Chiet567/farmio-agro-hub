import { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { DashboardLayout } from '@/components/DashboardLayout';
import { StatusPill } from '@/components/StatusPill';
import { SkeletonTable } from '@/components/SkeletonCard';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Download, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

type RoleFilter = 'all' | 'admin' | 'farmer' | 'expert' | 'buyer';
type StatusFilter = 'all' | 'active' | 'suspended' | 'pending' | 'banned';

export default function UsersPage() {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const { data: users, isLoading } = useQuery({
    queryKey: ['users', roleFilter, statusFilter, search],
    queryFn: async () => {
      const { data: profiles, error: pError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (pError) throw pError;

      const { data: roles, error: rError } = await supabase
        .from('user_roles')
        .select('*');
      if (rError) throw rError;

      let combined = (profiles || []).map(p => ({
        ...p,
        userRole: roles?.find(r => r.user_id === p.user_id),
      }));

      if (search) {
        const s = search.toLowerCase();
        combined = combined.filter(u => u.full_name?.toLowerCase().includes(s) || u.email?.toLowerCase().includes(s));
      }
      if (roleFilter !== 'all') {
        combined = combined.filter(u => u.userRole?.role === roleFilter);
      }
      if (statusFilter !== 'all') {
        combined = combined.filter(u => u.userRole?.status === statusFilter);
      }
      return combined;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: string }) => {
      const { error } = await supabase
        .from('user_roles')
        .update({ status: status as any })
        .eq('user_id', userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success(t('common.save'));
    },
  });

  const getRole = (user: any) => user.user_roles?.[0]?.role || 'buyer';
  const getStatus = (user: any) => user.user_roles?.[0]?.status || 'pending';
  const getLastLogin = (user: any) => user.user_roles?.[0]?.last_login;

  const statusMap: Record<string, string> = {
    active: t('status.active'),
    suspended: t('status.suspended'),
    pending: t('status.pending'),
    banned: t('status.banned'),
  };
  const roleMap: Record<string, string> = {
    admin: t('role.admin'),
    farmer: t('role.farmer'),
    expert: t('role.expert'),
    buyer: t('role.buyer'),
  };

  const exportCSV = () => {
    if (!users?.length) return;
    const headers = ['Name,Email,Role,Status,Registered'];
    const rows = users.map(u =>
      `"${u.full_name}","${u.email}","${getRole(u)}","${getStatus(u)}","${new Date(u.created_at).toLocaleDateString()}"`
    );
    const blob = new Blob([headers.concat(rows).join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.csv';
    a.click();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="font-display text-2xl font-bold">{t('users.title')}</h1>
          <div className="flex gap-2">
            <Button onClick={exportCSV} variant="outline" size="sm">
              <Download className="h-4 w-4 me-1" /> {t('common.export')}
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('users.search')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="ps-9"
            />
          </div>
          <Select value={roleFilter} onValueChange={v => setRoleFilter(v as RoleFilter)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder={t('users.allRoles')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('users.allRoles')}</SelectItem>
              <SelectItem value="admin">{t('role.admin')}</SelectItem>
              <SelectItem value="farmer">{t('role.farmer')}</SelectItem>
              <SelectItem value="expert">{t('role.expert')}</SelectItem>
              <SelectItem value="buyer">{t('role.buyer')}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={v => setStatusFilter(v as StatusFilter)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder={t('users.allStatuses')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('users.allStatuses')}</SelectItem>
              <SelectItem value="active">{t('status.active')}</SelectItem>
              <SelectItem value="suspended">{t('status.suspended')}</SelectItem>
              <SelectItem value="pending">{t('status.pending')}</SelectItem>
              <SelectItem value="banned">{t('status.banned')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <SkeletonTable rows={6} />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-start p-4 font-semibold">{t('users.name')}</th>
                    <th className="text-start p-4 font-semibold">{t('users.email')}</th>
                    <th className="text-start p-4 font-semibold">{t('users.role')}</th>
                    <th className="text-start p-4 font-semibold">{t('users.status')}</th>
                    <th className="text-start p-4 font-semibold">{t('users.registeredAt')}</th>
                    <th className="text-start p-4 font-semibold">{t('users.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.length === 0 && (
                    <tr><td colSpan={6} className="text-center p-8 text-muted-foreground">{t('common.noData')}</td></tr>
                  )}
                  {users?.map((user, i) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                    >
                      <td className="p-4 font-medium">{user.full_name || '—'}</td>
                      <td className="p-4 text-muted-foreground">{user.email}</td>
                      <td className="p-4">
                        <StatusPill status="active" label={roleMap[getRole(user)] || getRole(user)} />
                      </td>
                      <td className="p-4">
                        <StatusPill status={getStatus(user) as any} label={statusMap[getStatus(user)] || getStatus(user)} />
                      </td>
                      <td className="p-4 text-muted-foreground">{new Date(user.created_at).toLocaleDateString()}</td>
                      <td className="p-4">
                        <div className="flex gap-1">
                          {getStatus(user) !== 'active' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateStatus.mutate({ userId: user.user_id, status: 'active' })}
                              className="text-success hover:text-success"
                            >
                              {t('users.activate')}
                            </Button>
                          )}
                          {getStatus(user) === 'active' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateStatus.mutate({ userId: user.user_id, status: 'suspended' })}
                              className="text-warning hover:text-warning"
                            >
                              {t('users.suspend')}
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateStatus.mutate({ userId: user.user_id, status: 'banned' })}
                            className="text-destructive hover:text-destructive"
                          >
                            {t('users.ban')}
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
