import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowLeft, Sparkles } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { login } = useAuthStore();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Germen@600');
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
        setErrorMessage(result.error || 'فشل تسجيل الدخول');
        setIsLoading(false);
      }
    }, 250);
  };

  const handleQuickFill = () => {
    setUsername('admin');
    setPassword('Germen@600');
    setErrorMessage('');
  };

  return (
    <div className="w-screen h-screen bg-slate-100 flex items-center justify-center p-4 relative overflow-hidden select-none font-sans">
      {/* Background Architectural Grid Pattern */}
      <div className="absolute inset-0 bg-cad-grid opacity-60 pointer-events-none" />

      {/* Decorative Gradient Orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Login Card */}
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-8 relative z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center mx-auto shadow-lg shadow-blue-600/30 mb-4">
            <span className="font-mono font-black text-white text-xl tracking-tighter">KC</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            تسجيل الدخول <span className="text-blue-600 font-extrabold">كيتشن كاد برو</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1.5">
            منظومة التصميم ثنائية وثلاثية الأبعاد وجداول التقطيع والتسعير
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 animate-shake">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              اسم المستخدم (Username)
            </label>
            <div className="relative">
              <User size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="أدخل اسم المستخدم (admin)"
                className="w-full pr-10 pl-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 transition"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-slate-700">
                كلمة المرور (Password)
              </label>
              <button
                type="button"
                onClick={handleQuickFill}
                className="text-[11px] text-blue-600 hover:text-blue-700 font-bold"
              >
                تعبئة الافتراضي
              </button>
            </div>
            <div className="relative">
              <Lock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور"
                className="w-full pr-10 pl-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 transition"
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
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition transform active:scale-98 mt-2"
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

        {/* Credentials Tip Card */}
        <div className="mt-6 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] text-slate-600">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
            <Sparkles size={14} className="text-amber-500" />
            <span>بيانات الدخول الافتراضية للإدارة:</span>
          </div>
          <div className="flex items-center justify-between font-mono bg-white p-2 rounded-xl border border-slate-200 mt-1.5">
            <div>اليوزر: <strong className="text-blue-600">admin</strong></div>
            <div className="text-slate-300">|</div>
            <div>الباسورد: <strong className="text-emerald-700">Germen@600</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
};
