import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useSubscriptionStore } from '../../store/useSubscriptionStore';
import { dbService } from '../../services/dbService';
import { soundEffects } from '../../services/soundEffectsService';
import { Lock, User, Eye, EyeOff, ShieldCheck, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { login, loginAsTenant } = useAuthStore();
  const { setActiveTenant, checkSubscriptionValid } = useSubscriptionStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Auto-fill and auto-login from URL parameters if present
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const u = params.get('u') || params.get('user') || params.get('username');
    const p = params.get('p') || params.get('pass') || params.get('password');
    if (u) setUsername(u);
    if (p) setPassword(p);
    if (u && p) {
      performLogin(u, p);
    }
  }, []);

  const performLogin = async (inputUser: string, inputPass: string) => {
    setErrorMessage('');
    setIsLoading(true);

    try {
      const cleanUser = inputUser.trim().toLowerCase();
      const cleanPass = inputPass.trim();

      if (!cleanUser || !cleanPass) {
        setErrorMessage('يرجى إدخال اسم المستخدم وكلمة المرور');
        soundEffects.playError();
        setIsLoading(false);
        return;
      }

      // 1. Immediate Super Admin Priority Check
      if (cleanUser === 'admin' && cleanPass === 'Germen@600') {
        const result = login('admin', 'Germen@600');
        if (result.success) {
          setActiveTenant(null);
          soundEffects.playSuccess();
          setIsLoading(false);
          return;
        }
      }

      // 2. Check if it is a Subscribed Company Tenant in database
      let tenant = await dbService.findTenantByUsername(cleanUser);

      // Auto-activation for direct WhatsApp links or new trial subscribers
      const params = new URLSearchParams(window.location.search);
      const isFromActivationLink = params.has('u') || params.has('user');

      if (!tenant && isFromActivationLink && cleanUser && cleanPass) {
        const newTrialTenant = {
          id: `tenant-${Date.now()}`,
          companyName: cleanUser,
          contactPerson: cleanUser,
          phone: '',
          email: '',
          username: cleanUser,
          password: cleanPass,
          plan: 'trial' as const,
          status: 'active' as const,
          startDate: new Date().toISOString().split('T')[0],
          expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          maxProjects: 50,
          allowedModules: ['kitchen', 'dressing', 'bedroom', 'library'] as ('kitchen' | 'dressing' | 'bedroom' | 'library')[],
          createdAt: new Date().toISOString().split('T')[0],
        };
        await dbService.saveTenant(newTrialTenant);
        tenant = newTrialTenant;
      }

      if (tenant) {
        if (tenant.password === cleanPass) {
          const validity = checkSubscriptionValid(tenant);
          if (!validity.isValid) {
            setErrorMessage(validity.reason || 'عفواً، انتهت فترة الاشتراك المحددة لشركتكم. يرجى التواصل مع الإدارة للتجديد.');
            soundEffects.playError();
            setIsLoading(false);
            return;
          }

          // Valid Company Login
          setActiveTenant(tenant);
          loginAsTenant({
            id: tenant.id,
            username: tenant.username,
            companyName: tenant.companyName,
            createdAt: tenant.createdAt,
          });
          soundEffects.playSuccess();
          setIsLoading(false);
          return;
        } else {
          setErrorMessage('كلمة المرور غير صحيحة لحساب المشترك');
          soundEffects.playError();
          setIsLoading(false);
          return;
        }
      }

      // 3. Check Standard Local Users
      const result = login(cleanUser, cleanPass);
      if (!result.success) {
        setErrorMessage(result.error || 'اسم المستخدم أو كلمة المرور غير صحيحة');
        soundEffects.playError();
      } else {
        setActiveTenant(null);
        soundEffects.playSuccess();
      }
    } catch (err) {
      console.warn('Login fallback:', err);
      const cleanUser = inputUser.trim().toLowerCase();
      const cleanPass = inputPass.trim();
      const result = login(cleanUser, cleanPass);
      if (!result.success) {
        setErrorMessage('اسم المستخدم أو كلمة المرور غير صحيحة');
        soundEffects.playError();
      } else {
        soundEffects.playSuccess();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    performLogin(username, password);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-3 sm:p-6 md:p-8 relative overflow-y-auto font-sans select-none">
      
      {/* Background Architectural Grid Pattern */}
      <div 
        className="fixed inset-0 bg-cover bg-center opacity-30 scale-105 pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80')`
        }}
      />
      <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-[4px] pointer-events-none" />

      {/* Decorative Glows */}
      <div className="fixed top-1/4 -left-20 w-80 sm:w-96 h-80 sm:h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 -right-20 w-80 sm:w-96 h-80 sm:h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container Card */}
      <div className="relative z-10 w-full max-w-4xl bg-slate-900/90 border border-slate-800/90 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl my-auto animate-in fade-in zoom-in-95 duration-300">
        <div className="grid grid-cols-1 md:grid-cols-12">
          
          {/* DESKTOP LEFT / TOP SHOWCASE BANNER (Hidden on small mobile to give priority to login form) */}
          <div className="hidden md:flex md:col-span-6 relative bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 p-8 flex-col justify-between overflow-hidden border-l border-slate-800 text-white">
            {/* Top Brand Tag */}
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 border border-white/20">
                <span className="font-mono font-black text-white text-lg">FC</span>
              </div>
              <div>
                <div className="text-base font-black text-white">
                  فرنتشر كاد <span className="text-blue-400">برو</span>
                </div>
                <div className="text-xs text-slate-400 font-medium">نظام التصميم والتصنيع السحابي</div>
              </div>
            </div>

            {/* Center Visuals */}
            <div className="relative z-10 my-auto py-6 space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold rounded-full">
                <Sparkles size={13} className="text-amber-300" />
                <span>منظومة تصميم الأثاث والمطابخ</span>
              </span>
              <h2 className="text-2xl font-black text-white leading-snug">
                صمم بالدقة الهندسية 2D/3D واستخرج جداول التقطيع والتسعير فوراً
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                دعم كامل للمطابخ، الدريسينج، غرف النوم، والمكتبات مع حفظ سحابي دائم للمشاريع.
              </p>

              {/* Feature Chips */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-bold text-slate-200">
                <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/10">
                  <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                  <span>توليد كشوفات BOM</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/10">
                  <CheckCircle2 size={15} className="text-blue-400 shrink-0" />
                  <span>تسعير وش الوحدات م²</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/10">
                  <CheckCircle2 size={15} className="text-purple-400 shrink-0" />
                  <span>مسح بالكاميرا AI</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/10">
                  <CheckCircle2 size={15} className="text-amber-400 shrink-0" />
                  <span>تصدير PDF و DXF</span>
                </div>
              </div>
            </div>

            {/* Version */}
            <div className="relative z-10 text-[11px] text-slate-500 font-mono flex justify-between items-center border-t border-slate-800 pt-3">
              <span>FurnitureCAD Cloud v2.5</span>
              <span>تشفير آمن للبيانات 🔒</span>
            </div>
          </div>

          {/* RIGHT / MAIN LOGIN FORM (Optimized for Mobile & Desktop) */}
          <div className="md:col-span-6 p-6 sm:p-8 md:p-10 flex flex-col justify-center bg-white rounded-3xl md:rounded-r-none">
            
            {/* Mobile Header Brand (Visible on Mobile) */}
            <div className="md:hidden flex items-center justify-center gap-2.5 pb-4 mb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20 text-white font-mono font-black text-sm">
                FC
              </div>
              <div className="text-right">
                <h1 className="text-base font-black text-slate-900">
                  فرنتشر كاد <span className="text-blue-600">برو</span>
                </h1>
                <p className="text-[11px] text-slate-500 font-medium">تسجيل الدخول للنظام</p>
              </div>
            </div>

            {/* Desktop Header */}
            <div className="mb-5 text-right">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">تسجيل الدخول</h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                أدخل اسم المستخدم وكلمة المرور الخاصة بحسابك أو شركتك
              </p>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-start gap-2 animate-in fade-in duration-200">
                <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">{errorMessage}</div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Username Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 text-right">
                  اسم المستخدم (Username)
                </label>
                <div className="relative">
                  <User size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    autoFocus
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="اسم المستخدم أو كود الشركة"
                    className="w-full pr-11 pl-3 py-3 sm:py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 text-right">
                  كلمة المرور (Password)
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="أدخل كلمة المرور"
                    className="w-full pr-11 pl-11 py-3 sm:py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 transition"
                    title={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl text-sm font-black shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition transform active:scale-98 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <ShieldCheck size={18} />
                    <span>دخول إلى ساحة العمل 🚀</span>
                  </>
                )}
              </button>
            </form>

            {/* Footer Credits */}
            <div className="mt-6 pt-4 border-t border-slate-100 text-center space-y-1 text-[11px] text-slate-400 font-medium">
              <div className="flex items-center justify-center gap-1.5 flex-wrap">
                <span>تطوير وبرمجة:</span>
                <strong className="text-slate-700 font-mono font-bold">POM Agency</strong>
                <span className="text-slate-300">•</span>
                <a
                  href="mailto:sales@pom-agency.online"
                  className="font-mono text-blue-600 hover:underline font-bold"
                >
                  sales@pom-agency.online
                </a>
              </div>
              <p className="text-[10px] text-slate-400">
                منظومة فرنتشر كاد برو &copy; 2026 جميع الحقوق محفوظة
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
