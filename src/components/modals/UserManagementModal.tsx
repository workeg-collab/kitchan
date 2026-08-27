import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useSubscriptionStore } from '../../store/useSubscriptionStore';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Shield, 
  Check, 
  X, 
  KeyRound, 
  UserCheck,
  Building2,
  Calendar,
  Clock,
  Sparkles,
  Lock
} from 'lucide-react';

export const UserManagementModal: React.FC = () => {
  const { users, currentUser, isUserModalOpen, setIsUserModalOpen, addUser, deleteUser } = useAuthStore();
  const { activeTenant, checkSubscriptionValid } = useSubscriptionStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'admin' | 'designer' | 'workshop'>('designer');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isUserModalOpen) return null;

  const isAdmin = currentUser?.role === 'admin' || currentUser?.username.toLowerCase() === 'admin';

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    setFeedback(null);

    const result = addUser({
      username,
      password,
      name,
      role,
    });

    if (result.success) {
      setFeedback({ type: 'success', message: 'تمت إضافة المستخدم بنجاح!' });
      setUsername('');
      setPassword('');
      setName('');
    } else {
      setFeedback({ type: 'error', message: result.error || 'حدث خطأ' });
    }
  };

  const handleDelete = (id: string, uname: string) => {
    if (!isAdmin) return;
    if (window.confirm(`هل أنت متأكد من حذف المستخدم (${uname})؟`)) {
      const res = deleteUser(id);
      if (!res.success) {
        alert(res.error);
      }
    }
  };

  // Subscription validity for active tenant (subscriber)
  const subCheck = activeTenant ? checkSubscriptionValid(activeTenant) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 select-none font-sans animate-in fade-in">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden text-slate-900 flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${isAdmin ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-purple-50 text-purple-600 border border-purple-200'}`}>
              {isAdmin ? <Users size={20} /> : <UserCheck size={20} />}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {isAdmin ? 'إدارة المستخدمين وحسابات النظام' : 'بيانات حسابي واشتراكي'}
              </h2>
              <p className="text-xs text-slate-500">
                {isAdmin ? 'إضافة مستخدمين وتحديد الصلاحيات' : 'تفاصيل اشتراك الشركة وصلاحية الاستخدام'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsUserModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* ========================================================================= */}
          {/* NON-ADMIN / SUBSCRIBER VIEW: SHOW ONLY THEIR OWN SAFE ACCOUNT PROFILE */}
          {/* ========================================================================= */}
          {!isAdmin ? (
            <div className="space-y-4">
              {/* Profile Card */}
              <div className="p-5 bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-bold text-lg flex items-center justify-center shadow-md shadow-blue-600/20">
                      {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900">{currentUser?.name || currentUser?.username}</h3>
                      <p className="text-xs font-mono text-blue-600 font-bold">@{currentUser?.username}</p>
                    </div>
                  </div>

                  <span className="px-3 py-1 bg-purple-100 text-purple-800 border border-purple-200 rounded-full text-xs font-bold font-mono">
                    {activeTenant?.plan === 'trial' ? 'باقة تجريبية (14 يوم)' : activeTenant?.plan === 'yearly' ? 'اشتراك سنوي نشط' : 'حساب مصمم معتمد'}
                  </span>
                </div>

                {/* Subscription Expiry Badge */}
                {activeTenant && (
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200/80 text-xs">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Clock size={16} className="text-amber-600" />
                      <div>
                        <div className="text-[11px] text-slate-500">حالة الاشتراك</div>
                        <div className="font-bold text-emerald-700">نشط ({subCheck?.daysRemaining || 14} يوم متبقي)</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-slate-700">
                      <Calendar size={16} className="text-blue-600" />
                      <div>
                        <div className="text-[11px] text-slate-500">تاريخ انتهاء الصلاحية</div>
                        <div className="font-bold font-mono text-slate-900">{activeTenant.expiryDate}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Security & Role Features */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Shield size={15} className="text-emerald-600" />
                  <span>الصلاحيات والميزات المفعلة لحسابكم:</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 text-slate-600 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Check size={14} className="text-emerald-600" />
                    <span>تصميم مطابخ 2D / 3D كامل</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check size={14} className="text-emerald-600" />
                    <span>دريسينج روم وغرف ملابس L</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check size={14} className="text-emerald-600" />
                    <span>استخراج مقاسات وتفاصيل التقطيع</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check size={14} className="text-emerald-600" />
                    <span>تصدير ملفات PDF الفنية</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ========================================================================= */
            /* SUPER ADMIN VIEW ONLY: USER CREATION & MANAGEMENT */
            /* ========================================================================= */
            <>
              {/* Add New User Form */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono mb-3 flex items-center gap-1.5">
                  <UserPlus size={15} className="text-blue-600" />
                  إضافة مستخدم جديد للنظام
                </h3>

                {feedback && (
                  <div
                    className={`mb-3 p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                      feedback.type === 'success'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                  >
                    <span>{feedback.message}</span>
                  </div>
                )}

                <form onSubmit={handleAddUser} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700">اسم المستخدم (Username) *</label>
                      <input
                        type="text"
                        required
                        placeholder="مثال: designer1"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">كلمة المرور (Password) *</label>
                      <input
                        type="text"
                        required
                        placeholder="كلمة مرور"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700">الاسم الكامل / الصفة</label>
                      <input
                        type="text"
                        placeholder="مثال: م / أحمد سامي"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">نوع الصلاحية (Role)</label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value as any)}
                        className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500"
                      >
                        <option value="admin">مدير عام (Admin)</option>
                        <option value="designer">مهندس تصميم (Designer)</option>
                        <option value="workshop">فني ورشة وتصنيع (Workshop)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition"
                    >
                      <UserPlus size={14} />
                      <span>حفظ وإضافة المستخدم</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Existing Users List */}
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono mb-3">
                  قائمة المستخدمين المسجلين في النظام ({users.length})
                </h3>

                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs bg-white">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 uppercase tracking-wider font-mono text-[10px] border-b border-slate-200">
                        <th className="py-2.5 px-4 font-bold text-right">المستخدم</th>
                        <th className="py-2.5 px-4 font-bold text-right">الاسم الكامل</th>
                        <th className="py-2.5 px-4 font-bold text-right">الصلاحية</th>
                        <th className="py-2.5 px-4 font-bold text-right">تاريخ الإنشاء</th>
                        <th className="py-2.5 px-4 font-bold text-center">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-sans">
                      {users.map((u) => {
                        const isMainAdmin = u.username.toLowerCase() === 'admin';
                        const isCurrent = currentUser?.id === u.id;

                        return (
                          <tr key={u.id} className="hover:bg-slate-50/80 transition">
                            <td className="py-3 px-4 font-mono font-bold text-slate-900 text-right">
                              <div className="flex items-center gap-1.5 justify-start">
                                <span className="text-blue-600">{u.username}</span>
                                {isCurrent && (
                                  <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                                    أنت الآن
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="py-3 px-4 text-slate-700 text-right font-medium">
                              {u.name}
                            </td>

                            <td className="py-3 px-4 text-right">
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                                  u.role === 'admin'
                                    ? 'bg-purple-100 text-purple-800'
                                    : u.role === 'designer'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {u.role === 'admin' ? 'مدير عام' : u.role === 'designer' ? 'مصمم' : 'فني ورشة'}
                              </span>
                            </td>

                            <td className="py-3 px-4 font-mono text-slate-500 text-right text-[11px]">
                              {u.createdAt}
                            </td>

                            <td className="py-3 px-4 text-center">
                              {!isMainAdmin ? (
                                <button
                                  onClick={() => handleDelete(u.id, u.username)}
                                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                  title="حذف المستخدم"
                                >
                                  <Trash2 size={14} />
                                </button>
                              ) : (
                                <span className="text-[10px] text-slate-400 font-mono">أساسي</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
