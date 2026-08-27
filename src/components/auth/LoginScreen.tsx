import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Lock, User, Eye, EyeOff, ShieldCheck, Box, Compass, Scissors, Layers, CheckCircle2 } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { login } = useAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const result = login(username, password);
      if (!result.success) {
        setErrorMessage(result.error || 'اسم المستخدم أو كلمة المرور غير صحيحة');
        setIsLoading(false);
      }
    }, 200);
  };

  return (
    <div className="w-screen h-screen bg-slate-100 flex items-center justify-center p-4 md:p-8 relative overflow-hidden select-none font-sans">
      {/* Background Architectural Grid Pattern */}
      <div className="absolute inset-0 bg-cad-grid opacity-70 pointer-events-none" />

      {/* Decorative Blur Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Split-Screen Main Card */}
      <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden relative z-10 grid grid-cols-1 md:grid-cols-2 animate-in fade-in zoom-in-95 duration-200">
        {/* RIGHT SIDE: Modern Kitchen Visual Showcase */}
        <div className="relative bg-slate-900 text-white p-8 flex flex-col justify-between overflow-hidden min-h-[380px] md:min-h-[540px]">
          {/* High-Resolution Modern Luxury Kitchen Image with Subtle Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-60 scale-105 transition duration-700 hover:scale-100"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80')`
            }}
          />
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-900/40" />

          {/* Top Brand Tag */}
          <div className="relative z-10 flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="font-mono font-black text-white text-base tracking-tighter">KC</span>
            </div>
            <div>
              <div className="text-base font-bold tracking-tight text-white">
                كيتشن كاد <span className="text-blue-400 font-extrabold">برو</span>
              </div>
              <div className="text-[11px] text-slate-300 font-medium">KitchenCAD Manufacturing Engine</div>
            </div>
          </div>

          {/* Center Graphic Highlights */}
          <div className="relative z-10 my-auto py-6">
            <span className="inline-block px-3 py-1 bg-blue-500/20 border border-blue-400/40 text-blue-300 text-[11px] font-bold rounded-full mb-3 backdrop-blur-md">
              الجيل الأحدث لتصميم وتصنيع المطابخ
            </span>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-white leading-snug">
              صمم بالدقة الهندسية، شاهد مجسمك 3D، واستخرج جداول التقطيع والتسعير
            </h2>
            <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
              منظومة متكاملة لمهندسي الديكور وورش تصنيع المطابخ الحديثة بالمقاسات والمليمتر.
            </p>

            {/* Quick Feature Bullets */}
            <div className="grid grid-cols-2 gap-2.5 mt-6 text-xs font-semibold text-slate-200">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/10">
                <CheckCircle2 size={15} className="text-blue-400 shrink-0" />
                <span>مساقط 2D و 3D تفاعلية</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/10">
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                <span>حساب الأمتار والتسعير</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/10">
                <CheckCircle2 size={15} className="text-amber-400 shrink-0" />
                <span>جداول تقطيع الألواح</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/10">
                <CheckCircle2 size={15} className="text-purple-400 shrink-0" />
                <span>تصدير أوتوكاد و PDF</span>
              </div>
            </div>
          </div>

          {/* Footer Version */}
          <div className="relative z-10 text-[11px] text-slate-400 font-mono flex justify-between items-center border-t border-white/10 pt-3">
            <span>نسخة الويب السحابية v2.4</span>
            <span>نظام آمن ومحمي</span>
          </div>
        </div>

        {/* LEFT SIDE: Secure Login Form */}
        <div className="p-8 md:p-10 flex flex-col justify-center bg-white">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">تسجيل الدخول</h3>
            <p className="text-xs text-slate-500 mt-1">
              يرجى إدخال اسم المستخدم وكلمة المرور للمتابعة
            </p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 animate-shake">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                اسم المستخدم (Username)
              </label>
              <div className="relative">
                <User size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="أدخل اسم المستخدم"
                  className="w-full pr-10 pl-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 transition"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                كلمة المرور (Password)
              </label>
              <div className="relative">
                <Lock size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور"
                  className="w-full pr-10 pl-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition transform active:scale-98 mt-3"
            >
              {isLoading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck size={16} />
                  <span>دخول إلى ساحة التصميم</span>
                </>
              )}
            </button>
          </form>

          <p className="text-[11px] text-slate-400 text-center mt-6">
            منظومة كيتشن كاد برو &copy; 2026 جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </div>
  );
};
