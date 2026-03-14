export type Lang = 'fr' | 'ar';

const translations: Record<string, Record<Lang, string>> = {
  // Sidebar
  'nav.dashboard': { fr: 'Tableau de bord', ar: 'لوحة التحكم' },
  'nav.users': { fr: 'Utilisateurs', ar: 'المستخدمون' },
  'nav.products': { fr: 'Produits', ar: 'المنتجات' },
  'nav.reports': { fr: 'Signalements', ar: 'البلاغات' },
  'nav.statistics': { fr: 'Statistiques', ar: 'الإحصائيات' },
  'nav.logs': { fr: "Journaux d'activité", ar: 'سجلات النشاط' },
  'nav.settings': { fr: 'Paramètres', ar: 'الإعدادات' },
  'nav.logout': { fr: 'Déconnexion', ar: 'تسجيل الخروج' },

  // Dashboard
  'dashboard.title': { fr: 'Tableau de bord', ar: 'لوحة التحكم' },
  'dashboard.totalUsers': { fr: 'Utilisateurs totaux', ar: 'إجمالي المستخدمين' },
  'dashboard.activeUsers': { fr: 'Utilisateurs actifs', ar: 'المستخدمون النشطون' },
  'dashboard.totalProducts': { fr: 'Produits totaux', ar: 'إجمالي المنتجات' },
  'dashboard.totalRevenue': { fr: 'Revenus totaux', ar: 'إجمالي الإيرادات' },
  'dashboard.recentActivity': { fr: 'Activité récente', ar: 'النشاط الأخير' },
  'dashboard.userGrowth': { fr: 'Croissance des utilisateurs', ar: 'نمو المستخدمين' },
  'dashboard.productCategories': { fr: 'Catégories de produits', ar: 'فئات المنتجات' },

  // Users
  'users.title': { fr: 'Gestion des utilisateurs', ar: 'إدارة المستخدمين' },
  'users.name': { fr: 'Nom', ar: 'الاسم' },
  'users.email': { fr: 'Email', ar: 'البريد الإلكتروني' },
  'users.role': { fr: 'Rôle', ar: 'الدور' },
  'users.status': { fr: 'Statut', ar: 'الحالة' },
  'users.registeredAt': { fr: "Date d'inscription", ar: 'تاريخ التسجيل' },
  'users.lastLogin': { fr: 'Dernière connexion', ar: 'آخر تسجيل دخول' },
  'users.actions': { fr: 'Actions', ar: 'الإجراءات' },
  'users.search': { fr: 'Rechercher un utilisateur...', ar: 'البحث عن مستخدم...' },
  'users.addUser': { fr: 'Ajouter un utilisateur', ar: 'إضافة مستخدم' },
  'users.allRoles': { fr: 'Tous les rôles', ar: 'جميع الأدوار' },
  'users.allStatuses': { fr: 'Tous les statuts', ar: 'جميع الحالات' },
  'users.view': { fr: 'Voir', ar: 'عرض' },
  'users.edit': { fr: 'Modifier', ar: 'تعديل' },
  'users.suspend': { fr: 'Suspendre', ar: 'تعليق' },
  'users.activate': { fr: 'Activer', ar: 'تفعيل' },
  'users.ban': { fr: 'Bannir', ar: 'حظر' },

  // Roles
  'role.admin': { fr: 'Administrateur', ar: 'مدير' },
  'role.farmer': { fr: 'Agriculteur', ar: 'مزارع' },
  'role.expert': { fr: 'Expert', ar: 'خبير' },
  'role.buyer': { fr: 'Acheteur', ar: 'مشتري' },

  // Statuses
  'status.active': { fr: 'Actif', ar: 'نشط' },
  'status.suspended': { fr: 'Suspendu', ar: 'معلق' },
  'status.pending': { fr: 'En attente', ar: 'قيد الانتظار' },
  'status.banned': { fr: 'Banni', ar: 'محظور' },

  // Products
  'products.title': { fr: 'Modération des produits', ar: 'إدارة المنتجات' },
  'products.name': { fr: 'Nom du produit', ar: 'اسم المنتج' },
  'products.farmer': { fr: 'Agriculteur', ar: 'المزارع' },
  'products.price': { fr: 'Prix (DA)', ar: 'السعر (د.ج)' },
  'products.quantity': { fr: 'Quantité', ar: 'الكمية' },
  'products.status': { fr: 'Statut', ar: 'الحالة' },
  'products.date': { fr: 'Date', ar: 'التاريخ' },
  'products.approve': { fr: 'Approuver', ar: 'قبول' },
  'products.reject': { fr: 'Rejeter', ar: 'رفض' },
  'products.delete': { fr: 'Supprimer', ar: 'حذف' },
  'products.approved': { fr: 'Approuvé', ar: 'مقبول' },
  'products.rejected': { fr: 'Rejeté', ar: 'مرفوض' },
  'products.pending': { fr: 'En attente', ar: 'قيد الانتظار' },

  // Reports
  'reports.title': { fr: 'Gestion des signalements', ar: 'إدارة البلاغات' },
  'reports.reporter': { fr: 'Signaleur', ar: 'المبلّغ' },
  'reports.reported': { fr: 'Signalé', ar: 'المبلّغ عنه' },
  'reports.reason': { fr: 'Raison', ar: 'السبب' },
  'reports.date': { fr: 'Date', ar: 'التاريخ' },
  'reports.status': { fr: 'Statut', ar: 'الحالة' },
  'reports.process': { fr: 'Traiter', ar: 'معالجة' },
  'reports.processed': { fr: 'Traité', ar: 'تمت المعالجة' },
  'reports.unprocessed': { fr: 'Non traité', ar: 'لم تتم المعالجة' },

  // Settings
  'settings.title': { fr: 'Paramètres système', ar: 'إعدادات النظام' },
  'settings.general': { fr: 'Général', ar: 'عام' },
  'settings.appName': { fr: "Nom de l'application", ar: 'اسم التطبيق' },
  'settings.language': { fr: 'Langue', ar: 'اللغة' },
  'settings.currency': { fr: 'Devise', ar: 'العملة' },
  'settings.maintenance': { fr: 'Mode maintenance', ar: 'وضع الصيانة' },
  'settings.version': { fr: 'Version', ar: 'الإصدار' },

  // Logs
  'logs.title': { fr: "Journaux d'activité", ar: 'سجلات النشاط' },
  'logs.user': { fr: 'Utilisateur', ar: 'المستخدم' },
  'logs.action': { fr: 'Action', ar: 'الإجراء' },
  'logs.date': { fr: 'Date', ar: 'التاريخ' },
  'logs.type': { fr: 'Type', ar: 'النوع' },
  'logs.details': { fr: 'Détails', ar: 'التفاصيل' },

  // Common
  'common.search': { fr: 'Rechercher...', ar: 'بحث...' },
  'common.export': { fr: 'Exporter', ar: 'تصدير' },
  'common.filter': { fr: 'Filtrer', ar: 'تصفية' },
  'common.all': { fr: 'Tout', ar: 'الكل' },
  'common.save': { fr: 'Enregistrer', ar: 'حفظ' },
  'common.cancel': { fr: 'Annuler', ar: 'إلغاء' },
  'common.noData': { fr: 'Aucune donnée', ar: 'لا توجد بيانات' },
  'common.loading': { fr: 'Chargement...', ar: 'جاري التحميل...' },

  // Login
  'login.title': { fr: 'Connexion Administrateur', ar: 'تسجيل دخول المدير' },
  'login.email': { fr: 'Adresse email', ar: 'البريد الإلكتروني' },
  'login.password': { fr: 'Mot de passe', ar: 'كلمة المرور' },
  'login.submit': { fr: 'Se connecter', ar: 'تسجيل الدخول' },
  'login.error': { fr: 'Email ou mot de passe incorrect', ar: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
};

export function t(key: string, lang: Lang): string {
  return translations[key]?.[lang] || key;
}

export default translations;
