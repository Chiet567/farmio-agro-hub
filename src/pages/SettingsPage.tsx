import { useLanguage } from '@/i18n/LanguageContext';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function SettingsPage() {
  const { t, lang, setLang } = useLanguage();
  const [appName, setAppName] = useState('Farmio');
  const [maintenance, setMaintenance] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <h1 className="font-display text-2xl font-bold">{t('settings.title')}</h1>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 space-y-6">
          <h2 className="font-display text-lg font-semibold">{t('settings.general')}</h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('settings.appName')}</Label>
              <Input value={appName} onChange={e => setAppName(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>{t('settings.language')}</Label>
              <Select value={lang} onValueChange={(v) => setLang(v as 'fr' | 'ar')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="ar">العربية</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t('settings.currency')}</Label>
              <Input value="Dinar Algérien (DA)" disabled />
            </div>

            <div className="flex items-center justify-between">
              <Label>{t('settings.maintenance')}</Label>
              <Switch checked={maintenance} onCheckedChange={setMaintenance} />
            </div>

            <div className="space-y-2">
              <Label>{t('settings.version')}</Label>
              <p className="text-sm text-muted-foreground">Farmio v1.0.0</p>
            </div>
          </div>

          <Button>{t('common.save')}</Button>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
