import React, { useEffect, useState } from 'react';
import { useSubscriptionStore } from '../../store/useSubscriptionStore';
import { CompanyTenant, SubscriptionPlan } from '../../types/subscription';
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
  Layers
} from 'lucide-react';

export const AdminSubscriptionDashboard: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
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

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'expired' | 'suspended'>('all');
  const [isCreatingNew, setIsCreatingNew] = useState(false);

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

  useEffect(() => {
    if (isOpen) {
      fetchTenants();
    }
  }, [isOpen]);

  if (!isOpen) return null;

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
    const matchesSearch = 
      t.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.phone.includes(searchQuery);
    
    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'active') return matchesSearch && t.status === 'active' && checkSubscriptionValid(t).isValid;
    if (filterStatus === 'expired') return matchesSearch && !checkSubscriptionValid(t).isValid;
    if (filterStatus === 'suspended') return matchesSearch && t.status === 'suspended';
    return matchesSearch;
  });

  const totalActive = tenants.filter(t => t.status === 'active' && checkSubscriptionValid(t).isValid).length;
  const totalExpired = tenants.filter(t => !checkSubscriptionValid(t).isValid).length;

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
                لوحة تحكم وتوزيع الاشتراكات والشركات (Super Admin License Manager)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                إدارة تراخيص الشركات، إنشاء حسابات العملاء، تحديد مدد الاشتراك، وتجديد الباقات
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCreatingNew(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-bold shadow-md shadow-blue-600/20 transition transform active:scale-95"
            >
              <Plus size={16} />
              <span>إنشاء اشتراك شركة جديد</span>
            </button>
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
            <div className="text-[11px] font-bold text-emerald-700">الاشتراكات النشطة</div>
            <div className="text-2xl font-black text-emerald-700 mt-1">{totalActive} نشط</div>
          </div>
          <div className="bg-red-50/70 p-4 rounded-2xl border border-red-200">
            <div className="text-[11px] font-bold text-red-700">اشتراكات منتهية / متوقفة</div>
            <div className="text-2xl font-black text-red-700 mt-1">{totalExpired} منتهي</div>
          </div>
          <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200">
            <div className="text-[11px] font-bold text-blue-700">حماية وقاعدة البيانات</div>
            <div className="text-xs font-sans font-bold text-blue-900 mt-2 flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-blue-600" />
              <span>داتا بيز مشفرة ودائمة</span>
            </div>
          </div>
        </div>

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
              className={`px-3 py-1.5 rounded-lg transition ${filterStatus === 'all' ? 'bg-white text-blue-600 shadow-sm' : 'hover:text-slate-900'}`}
            >
              الكل ({tenants.length})
            </button>
            <button
              onClick={() => setFilterStatus('active')}
              className={`px-3 py-1.5 rounded-lg transition ${filterStatus === 'active' ? 'bg-white text-emerald-600 shadow-sm' : 'hover:text-slate-900'}`}
            >
              النشطة ({totalActive})
            </button>
            <button
              onClick={() => setFilterStatus('expired')}
              className={`px-3 py-1.5 rounded-lg transition ${filterStatus === 'expired' ? 'bg-white text-red-600 shadow-sm' : 'hover:text-slate-900'}`}
            >
              المنتهية ({totalExpired})
            </button>
          </div>
        </div>

        {/* Tenants Table */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono">
                <tr>
                  <th className="px-4 py-3.5">الشركة والمسؤول</th>
                  <th className="px-4 py-3.5">بيانات الدخول (User / Pass)</th>
                  <th className="px-4 py-3.5">خطة الاشتراك</th>
                  <th className="px-4 py-3.5">تاريخ الانتهاء</th>
                  <th className="px-4 py-3.5 text-center">الحالة والمتبقي</th>
                  <th className="px-4 py-3.5 text-center">إجراءات التحكم</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {filteredTenants.map((t) => {
                  const check = checkSubscriptionValid(t);
                  return (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-900 text-xs">{t.companyName}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                          <span>{t.contactPerson || '-'}</span>
                          <span>•</span>
                          <span className="font-mono text-slate-600">{t.phone || '-'}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 font-mono">
                        <div className="text-blue-600 font-bold">@{t.username}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">Pass: {t.password}</div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase font-mono ${
                          t.plan === 'trial' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                          t.plan === 'yearly' ? 'bg-blue-100 text-blue-800' :
                          t.plan === 'monthly' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {t.plan === 'trial' ? 'تجريبي (14 يوم)' : t.plan === 'yearly' ? 'سنوي (Yearly)' : t.plan === 'monthly' ? 'شهري (Monthly)' : 'مدى الحياة'}
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
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Copy WhatsApp Activation Link & Message */}
                          <button
                            onClick={() => {
                              const origin = window.location.origin;
                              const directUrl = `${origin}/?u=${encodeURIComponent(t.username)}&p=${encodeURIComponent(t.password)}`;
                              const msg = `مرحباً بك م/ ${t.contactPerson || t.companyName}،\nتم تفعيل حسابكم في منصة فرنتشر كاد برو (${t.plan === 'trial' ? 'نسخة تجريبية 14 يوم' : 'اشتراك مفعل'}):\n• اسم المستخدم: ${t.username}\n• كلمة المرور: ${t.password}\n• رابط الدخول المباشر والفوري:\n${directUrl}`;
                              navigator.clipboard.writeText(msg);
                              alert(`✅ تم نسخ رسالة التفعيل ورابط الدخول المباشر بنجاح!\n\nيمكنك الآن لصقها في واتساب وإرسالها للعميل فوراً.`);
                            }}
                            className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold transition shadow-xs"
                            title="نسخ رسالة التفعيل مع رابط دخول فوري للواتساب"
                          >
                            <Phone size={11} />
                            <span>نسخ للواتساب</span>
                          </button>

                          {/* Renew +1 Year */}
                          <button
                            onClick={() => renewSubscription(t.id, 'yearly', 12)}
                            className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-[10px] font-bold transition border border-blue-200"
                            title="تجديد لمدة سنة"
                          >
                            +1 سنة
                          </button>
                          {/* Renew +1 Month */}
                          <button
                            onClick={() => renewSubscription(t.id, 'monthly', 1)}
                            className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-[10px] font-bold transition border border-amber-200"
                            title="تجديد لمدة شهر"
                          >
                            +1 شهر
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
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create New Company Modal Overlay */}
        {isCreatingNew && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-slate-900">إنشاء ترخيص واشتراك لشركة جديدة</h3>
                <button onClick={() => setIsCreatingNew(false)} className="p-1 text-slate-400 hover:text-slate-700">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateCompany} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700">اسم الشركة / المصنع / المعرض *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: شركة مودرن لاين للمطابخ والديكور"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700">اسم المسؤول</label>
                    <input
                      type="text"
                      placeholder="م / محمد علي"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700">رقم الهاتف / الواتساب</label>
                    <input
                      type="text"
                      placeholder="010XXXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Login Credentials */}
                <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200 space-y-3">
                  <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                    <Key size={14} className="text-blue-600" />
                    <span>بيانات تسجيل الدخول المخصصة للشركة</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700">اسم المستخدم (Username) *</label>
                      <input
                        type="text"
                        required
                        placeholder="modernline"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono font-bold text-blue-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">كلمة المرور (Password) *</label>
                      <input
                        type="text"
                        required
                        placeholder="Modern@2026"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Subscription Plan & Duration */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700">نوع خطة الاشتراك</label>
                    <select
                      value={plan}
                      onChange={(e) => {
                        const newPlan = e.target.value as SubscriptionPlan;
                        setPlan(newPlan);
                        if (newPlan === 'yearly') setDurationMonths(12);
                        else if (newPlan === 'monthly') setDurationMonths(1);
                        else if (newPlan === 'lifetime') setDurationMonths(120);
                      }}
                      className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                    >
                      <option value="yearly">اشتراك سنوي (12 شهر)</option>
                      <option value="monthly">اشتراك شهري (1 شهر)</option>
                      <option value="lifetime">اشتراك مفتوح مدى الحياة</option>
                      <option value="trial">تجريبي (14 يوم)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700">المدة بالشهور</label>
                    <input
                      type="number"
                      min={1}
                      value={durationMonths}
                      onChange={(e) => setDurationMonths(Number(e.target.value))}
                      className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsCreatingNew(false)}
                    className="px-4 py-2 text-slate-600 hover:text-slate-900 font-semibold"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-md shadow-blue-600/20 transition"
                  >
                    إنشاء وحفظ الاشتراك
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
