import React, { useEffect, useState } from 'react';
import { useSubscriptionStore } from '../../store/useSubscriptionStore';
import { useAuthStore } from '../../store/useAuthStore';
import { CompanyTenant, SubscriptionPlan } from '../../types/subscription';
import { liveTelemetry, LiveSubscriberSession } from '../../services/liveTelemetryService';
import { LiveStealthMonitorModal } from './LiveStealthMonitorModal';
import { 
  Building2, 
  Users, 
  Plus, 
  Search, 
  Calendar, 
  ShieldCheck, 
  AlertCircle, 
  RefreshCw, 
  CheckCircle2, 
  X, 
  Key, 
  Phone, 
  Clock, 
  Trash2, 
  Power,
  Sparkles,
  Layers,
  Radio,
  Eye,
  Activity,
  Box,
  Compass
} from 'lucide-react';

export const AdminSubscriptionDashboard: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { currentUser } = useAuthStore();
  const { 
    tenants, 
    fetchTenants, 
    createTenant, 
    updateTenant, 
    renewSubscription, 
    toggleTenantStatus, 
    deleteTenant, 
    checkSubscriptionValid 
  } = useSubscriptionStore();

  const [activeTab, setActiveTab] = useState<'companies' | 'live-monitor'>('companies');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'expired' | 'suspended'>('all');
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Live Telemetry Sessions
  const [liveSessions, setLiveSessions] = useState<LiveSubscriberSession[]>([]);
  const [monitoredSession, setMonitoredSession] = useState<LiveSubscriberSession | null>(null);

  // New Company Form State
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [plan, setPlan] = useState<SubscriptionPlan>('yearly');
  const [durationMonths, setDurationMonths] = useState(12);
  const [notes, setNotes] = useState('');

  const isAdmin = currentUser?.role === 'admin' || currentUser?.username.toLowerCase() === 'admin';

  useEffect(() => {
    if (isOpen && isAdmin) {
      fetchTenants();
      const unsubscribe = liveTelemetry.subscribeToSessions((sessions) => {
        setLiveSessions(sessions);
      });
      return () => unsubscribe();
    }
  }, [isOpen, isAdmin]);

  if (!isOpen || !isAdmin) return null;

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !username.trim() || !password.trim()) {
      alert('يرجى ملء جميع الحقول الإلزامية');
      return;
    }

    const startDate = new Date();
    const expiryDate = new Date();
    if (plan === 'trial') {
      expiryDate.setDate(expiryDate.getDate() + 14);
    } else if (plan === 'lifetime') {
      expiryDate.setFullYear(expiryDate.getFullYear() + 20);
    } else {
      expiryDate.setMonth(expiryDate.getMonth() + durationMonths);
    }

    await createTenant({
      companyName: companyName.trim(),
      contactPerson: contactPerson.trim(),
      phone: phone.trim(),
      email: email.trim(),
      username: username.trim().toLowerCase(),
      password: password.trim(),
      plan,
      status: 'active',
      startDate: startDate.toISOString().split('T')[0],
      expiryDate: expiryDate.toISOString().split('T')[0],
      maxProjects: plan === 'yearly' || plan === 'lifetime' ? 9999 : 100,
      allowedModules: ['kitchen', 'dressing', 'bedroom', 'library'],
      notes: notes.trim(),
    });

    setIsCreatingNew(false);
    // Reset form
    setCompanyName('');
    setContactPerson('');
    setPhone('');
    setEmail('');
    setUsername('');
    setPassword('');
    setNotes('');
  };

  const filteredTenants = tenants.filter((t) => {
    const query = searchQuery.toLowerCase().trim();
    const matchSearch =
      t.companyName.toLowerCase().includes(query) ||
      t.username.toLowerCase().includes(query) ||
      t.contactPerson?.toLowerCase().includes(query) ||
      t.phone?.includes(query);

    if (!matchSearch) return false;

    const check = checkSubscriptionValid(t);
    if (filterStatus === 'active') return t.status === 'active' && check.isValid;
    if (filterStatus === 'expired') return !check.isValid;
    if (filterStatus === 'suspended') return t.status === 'suspended';
    return true;
  });

  const totalActive = tenants.filter((t) => t.status === 'active' && checkSubscriptionValid(t).isValid).length;
  const totalExpired = tenants.filter((t) => !checkSubscriptionValid(t).isValid).length;
  const onlineSubscribers = liveSessions.filter((s) => s.isOnline);

  const moduleLabels: Record<string, string> = {
    kitchen: 'مطابخ',
    dressing: 'دريسينج',
    bedroom: 'غرف نوم',
    library: 'مكتبات',
  };

  const tabLabels: Record<string, string> = {
    dashboard: 'صفحة الأقسام',
    '2d-plan': 'المخطط 2D',
    '3d-view': 'المنظور 3D',
    elevations: 'المساقط الرأسية',
    technical: 'المخطط الهندسي',
    schedule: 'جدول التوصيف',
    'cutting-list': 'جدول التقطيع',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-in fade-in select-none font-sans">
      <div className="w-full max-w-6xl max-h-[92vh] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Top Header */}
        <div className="px-8 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 text-white rounded-2xl shadow-md shadow-blue-600/20">
              <Building2 size={22} />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">
                لوحة تحكم الاشتراكات والمراقبة الحية (Super Admin Console)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                إدارة تراخيص الشركات، المشتركون المتواجدون أونلاين، والبث الحي للشاشات
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Tab Navigation Switcher */}
            <div className="flex items-center bg-slate-200/80 p-1 rounded-2xl text-xs font-bold">
              <button
                onClick={() => setActiveTab('companies')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition ${
                  activeTab === 'companies' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 size={14} />
                <span>إدارة التراخيص ({tenants.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('live-monitor')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition ${
                  activeTab === 'live-monitor' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>المتواجدون الآن ({onlineSubscribers.length})</span>
              </button>
            </div>

            {activeTab === 'companies' && (
              <button
                onClick={() => setIsCreatingNew(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-bold shadow-md shadow-blue-600/20 transition transform active:scale-95"
              >
                <Plus size={16} />
                <span>إنشاء مشترك جديد</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* KPI Stats Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 px-8 py-4 bg-white border-b border-slate-100 font-mono">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="text-[11px] font-bold text-slate-400">إجمالي الشركات المسجلة</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{tenants.length} شركة</div>
          </div>
          <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200">
            <div className="text-[11px] font-bold text-emerald-700">المتواجدون أونلاين الآن</div>
            <div className="text-2xl font-black text-emerald-700 mt-1 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{onlineSubscribers.length} متصل</span>
            </div>
          </div>
          <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200">
            <div className="text-[11px] font-bold text-blue-700">الاشتراكات النشطة</div>
            <div className="text-2xl font-black text-blue-700 mt-1">{totalActive} نشط</div>
          </div>
          <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-200">
            <div className="text-[11px] font-bold text-purple-700">المراقبة والبث السري</div>
            <div className="text-xs font-sans font-bold text-purple-900 mt-2 flex items-center gap-1.5">
              <Eye size={15} className="text-purple-600" />
              <span>بث حي صامت بدون إشعار</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: COMPANIES & LICENSES TABLE */}
        {/* ========================================================================= */}
        {activeTab === 'companies' && (
          <>
            {/* Search & Filter Toolbar */}
            <div className="px-8 py-3 bg-white border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <input
                  type="text"
                  placeholder="بحث باسم الشركة، المستخدم، أو الهاتف..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    filterStatus === 'all' ? 'bg-white text-blue-600 shadow-sm' : 'hover:text-slate-900'
                  }`}
                >
                  الكل ({tenants.length})
                </button>
                <button
                  onClick={() => setFilterStatus('active')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    filterStatus === 'active' ? 'bg-white text-emerald-600 shadow-sm' : 'hover:text-slate-900'
                  }`}
                >
                  النشطة ({totalActive})
                </button>
                <button
                  onClick={() => setFilterStatus('expired')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    filterStatus === 'expired' ? 'bg-white text-red-600 shadow-sm' : 'hover:text-slate-900'
                  }`}
                >
                  المنتهية ({totalExpired})
                </button>
              </div>
            </div>

            {/* Tenants Table */}
            <div className="flex-1 overflow-y-auto p-8">
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 font-mono text-[11px]">
                    <tr>
                      <th className="px-4 py-3">الشركة / المصنع</th>
                      <th className="px-4 py-3">بيانات الدخول</th>
                      <th className="px-4 py-3">حالة الاتصال والنشاط</th>
                      <th className="px-4 py-3">باقة الاشتراك</th>
                      <th className="px-4 py-3">تاريخ الانتهاء</th>
                      <th className="px-4 py-3 text-center">الحالة</th>
                      <th className="px-4 py-3 text-center">الإجراءات والمراقبة</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 bg-white font-sans">
                    {filteredTenants.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-slate-400 font-medium">
                          لا توجد شركات مطابقة للبحث أو التصفية الحالية
                        </td>
                      </tr>
                    ) : (
                      filteredTenants.map((t) => {
                        const check = checkSubscriptionValid(t);
                        const liveSess = liveSessions.find(
                          (s) => s.username.toLowerCase() === t.username.toLowerCase() && s.isOnline
                        );

                        return (
                          <tr key={t.id} className="hover:bg-slate-50/80 transition">
                            <td className="px-4 py-3.5">
                              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                <span>{t.companyName}</span>
                              </div>
                              <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                                {t.contactPerson || 'غير محدد'} • {t.phone || 'بدون هاتف'}
                              </div>
                            </td>

                            <td className="px-4 py-3.5 font-mono">
                              <div className="text-blue-600 font-bold">@{t.username}</div>
                              <div className="text-[11px] text-slate-400 mt-0.5">Pass: {t.password}</div>
                            </td>

                            <td className="px-4 py-3.5">
                              {liveSess ? (
                                <div className="space-y-1">
                                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                                    <span>متصل الآن ({moduleLabels[liveSess.activeModule] || liveSess.activeModule})</span>
                                  </span>
                                  <div className="text-[10px] text-slate-500 truncate max-w-[150px]">
                                    {liveSess.lastAction}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-slate-400 text-[11px] font-mono">غير متصل</span>
                              )}
                            </td>

                            <td className="px-4 py-3.5">
                              <span
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase font-mono ${
                                  t.plan === 'trial'
                                    ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                    : t.plan === 'yearly'
                                    ? 'bg-blue-100 text-blue-800'
                                    : t.plan === 'monthly'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}
                              >
                                {t.plan === 'trial'
                                  ? 'تجريبي (14 يوم)'
                                  : t.plan === 'yearly'
                                  ? 'سنوي (Yearly)'
                                  : t.plan === 'monthly'
                                  ? 'شهري (Monthly)'
                                  : 'مدى الحياة'}
                              </span>
                            </td>

                            <td className="px-4 py-3.5 font-mono text-slate-700 font-semibold">
                              {t.expiryDate}
                            </td>

                            <td className="px-4 py-3.5 text-center">
                              {check.isValid ? (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-bold">
                                  <CheckCircle2 size={12} />
                                  <span>نشط ({check.daysRemaining} يوم متبقي)</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-[11px] font-bold">
                                  <AlertCircle size={12} />
                                  <span>منتهي / متوقف</span>
                                </span>
                              )}
                            </td>

                            <td className="px-4 py-3.5 text-center">
                              <div className="flex items-center justify-center gap-1.5 flex-wrap">
                                {/* Live Stealth Screen Monitor Button */}
                                {liveSess && (
                                  <button
                                    onClick={() => setMonitoredSession(liveSess)}
                                    className="flex items-center gap-1 px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-[10px] font-bold transition shadow-xs animate-bounce"
                                    title="بث ومراقبة شاشة المشترك الحية سرياً"
                                  >
                                    <Eye size={11} />
                                    <span>مراقبة الشاشة</span>
                                  </button>
                                )}

                                {/* WhatsApp Link */}
                                <button
                                  onClick={() => {
                                    const origin = window.location.origin;
                                    const directUrl = `${origin}/?u=${encodeURIComponent(t.username)}&p=${encodeURIComponent(t.password)}`;
                                    const msg = `مرحباً بك م/ ${t.contactPerson || t.companyName}،\nتم تفعيل حسابكم في منصة فرنتشر كاد برو (${t.plan === 'trial' ? 'نسخة تجريبية 14 يوم' : 'اشتراك مفعل'}):\n• اسم المستخدم: ${t.username}\n• كلمة المرور: ${t.password}\n• رابط الدخول المباشر والفوري:\n${directUrl}`;
                                    navigator.clipboard.writeText(msg);
                                    alert(`✅ تم نسخ رسالة التفعيل ورابط الدخول المباشر بنجاح!`);
                                  }}
                                  className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold transition shadow-xs"
                                  title="نسخ رسالة التفعيل للواتساب"
                                >
                                  <Phone size={11} />
                                  <span>واتساب</span>
                                </button>

                                {/* Renew +1 Year */}
                                <button
                                  onClick={() => renewSubscription(t.id, 'yearly', 12)}
                                  className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-[10px] font-bold transition border border-blue-200"
                                  title="تجديد لمدة سنة"
                                >
                                  +1 سنة
                                </button>

                                {/* Toggle Suspend */}
                                <button
                                  onClick={() => toggleTenantStatus(t.id)}
                                  className={`p-1.5 rounded-lg transition border ${
                                    t.status === 'active' ? 'bg-slate-100 text-slate-600 hover:text-amber-600' : 'bg-emerald-50 text-emerald-600'
                                  }`}
                                  title={t.status === 'active' ? 'إيقاف مؤقت' : 'تفعيل'}
                                >
                                  <Power size={13} />
                                </button>

                                {/* Delete */}
                                <button
                                  onClick={() => {
                                    if (window.confirm(`هل أنت متأكد من حذف شركة "${t.companyName}"؟`)) {
                                      deleteTenant(t.id);
                                    }
                                  }}
                                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                  title="حذف"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: LIVE STEALTH ONLINE MONITOR (المتواجدون أونلاين والشاشات الحية) */}
        {/* ========================================================================= */}
        {activeTab === 'live-monitor' && (
          <div className="flex-1 overflow-y-auto p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                  <span>المشتركون المتواجدون في ساحة العمل الآن ({onlineSubscribers.length})</span>
                </h3>
                <p className="text-xs text-slate-500">
                  مراقبة مباشرة للحركات والتصميمات مع إمكانية فتح البث الحي للوحة التصميم بدون علم المشترك
                </p>
              </div>

              <div className="text-xs font-mono text-slate-400">
                تحديث تلقائي كل 3 ثوانٍ
              </div>
            </div>

            {onlineSubscribers.length === 0 ? (
              <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 space-y-3">
                <Radio size={36} className="text-slate-300 mx-auto" />
                <div className="text-sm font-bold text-slate-700">لا يوجد مشتركون متصلون أونلاين في هذه اللحظة</div>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  بمجرد قيام أي مشترك بتسجيل الدخول والبدء في التصميم، سيظهر هنا فوراً في بث حي ومباشر.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {onlineSubscribers.map((sess) => (
                  <div
                    key={sess.tenantId}
                    className="p-5 bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl border border-slate-800 shadow-xl space-y-4 hover:border-emerald-500/50 transition-all group"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold font-mono">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          <span>متصل الآن</span>
                        </span>
                        <h4 className="text-sm font-extrabold text-white mt-1.5">{sess.companyName || sess.username}</h4>
                        <p className="text-xs font-mono text-blue-400">@{sess.username}</p>
                      </div>

                      <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded-lg text-[10px] font-mono font-bold">
                        {sess.plan}
                      </span>
                    </div>

                    {/* Telemetry Metrics */}
                    <div className="p-3 bg-slate-800/60 rounded-2xl space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-300">
                        <span>القسم النشط:</span>
                        <span className="font-bold text-emerald-400">{moduleLabels[sess.activeModule] || sess.activeModule}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>الصفحة / التاب:</span>
                        <span className="font-bold text-blue-400">{tabLabels[sess.activeTab] || sess.activeTab}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>الوحدات بالرسمة:</span>
                        <span className="font-bold font-mono text-white">{sess.cabinetCount} وحدة</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>آخر حركة:</span>
                        <span className="font-bold text-amber-300 text-[11px] truncate max-w-[130px]">{sess.lastAction}</span>
                      </div>
                    </div>

                    {/* Open Stealth Screen Button */}
                    <button
                      onClick={() => setMonitoredSession(sess)}
                      className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition transform active:scale-98"
                    >
                      <Eye size={14} />
                      <span>فتح شاشة البث والمراقبة الحية</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Create New Company Modal Overlay */}
        {isCreatingNew && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Plus size={18} className="text-blue-600" />
                  <span>إضافة وتفعيل اشتراك لشركة جديدة</span>
                </div>
                <button
                  onClick={() => setIsCreatingNew(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateCompany} className="space-y-3.5 mt-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700">اسم الشركة أو المصنع *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: مطابخ الأهرام الحديثة"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700">اسم المسؤول</label>
                    <input
                      type="text"
                      placeholder="مثال: م / طارق سامي"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700">رقم الهاتف / واتساب</label>
                    <input
                      type="text"
                      placeholder="01012345678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700">اسم المستخدم (Username) *</label>
                    <input
                      type="text"
                      required
                      placeholder="ahram_kitchens"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700">كلمة المرور (Password) *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ahram@2026"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700">نوع باقة الاشتراك</label>
                    <select
                      value={plan}
                      onChange={(e) => {
                        const newPlan = e.target.value as SubscriptionPlan;
                        setPlan(newPlan);
                        if (newPlan === 'trial') setDurationMonths(1);
                        else if (newPlan === 'yearly') setDurationMonths(12);
                      }}
                      className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:border-blue-500"
                    >
                      <option value="trial">تجريبي مجاني (14 يوم)</option>
                      <option value="monthly">اشتراك شهري (Monthly)</option>
                      <option value="yearly">اشتراك سنوي (Yearly)</option>
                      <option value="lifetime">ترخيص دائم (Lifetime)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700">مدة الاشتراك</label>
                    <input
                      type="number"
                      disabled={plan === 'trial' || plan === 'lifetime'}
                      min={1}
                      max={60}
                      value={plan === 'trial' ? 14 : durationMonths}
                      onChange={(e) => setDurationMonths(parseInt(e.target.value) || 1)}
                      className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-blue-500 disabled:opacity-60"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsCreatingNew(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-md shadow-blue-600/20 transition"
                  >
                    حفظ وتفعيل الحساب فوراً
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Live Stealth Monitor Modal */}
        {monitoredSession && (
          <LiveStealthMonitorModal
            session={monitoredSession}
            onClose={() => setMonitoredSession(null)}
          />
        )}
      </div>
    </div>
  );
};
