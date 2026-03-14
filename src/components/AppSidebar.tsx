import {
  LayoutDashboard,
  Users,
  Package,
  Flag,
  BarChart3,
  ScrollText,
  Settings,
  LogOut,
  Globe,
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { FarmioLogo } from './FarmioLogo';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';

const navItems = [
  { titleKey: 'nav.dashboard', url: '/', icon: LayoutDashboard },
  { titleKey: 'nav.users', url: '/users', icon: Users },
  { titleKey: 'nav.products', url: '/products', icon: Package },
  { titleKey: 'nav.reports', url: '/reports', icon: Flag },
  { titleKey: 'nav.statistics', url: '/statistics', icon: BarChart3 },
  { titleKey: 'nav.logs', url: '/logs', icon: ScrollText },
  { titleKey: 'nav.settings', url: '/settings', icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const { t, lang, setLang } = useLanguage();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar collapsible="icon" className="border-sidebar-border">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <FarmioLogo collapsed={collapsed} />
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.titleKey}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={collapsed ? t(item.titleKey) : undefined}
                  >
                    <NavLink
                      to={item.url}
                      end={item.url === '/'}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-200"
                      activeClassName="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground shadow-md"
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!collapsed && (
                        <span className="font-medium text-sm">{t(item.titleKey)}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-sidebar-border space-y-1">
        <button
          onClick={() => setLang(lang === 'fr' ? 'ar' : 'fr')}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-200 text-sm"
        >
          <Globe className="h-5 w-5 shrink-0" />
          {!collapsed && <span>{lang === 'fr' ? 'العربية' : 'Français'}</span>}
        </button>
        <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-destructive/80 hover:text-destructive hover:bg-destructive/10 transition-all duration-200 text-sm">
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>{t('nav.logout')}</span>}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
