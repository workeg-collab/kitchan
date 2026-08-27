import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Shield, 
  Check, 
  X, 
  KeyRound, 
  UserCheck 
} from 'lucide-react';

export const UserManagementModal: React.FC = () => {
  const { users, currentUser, isUserModalOpen, setIsUserModalOpen, addUser, deleteUser } = useAuthStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'admin' | 'designer' | 'workshop'>('designer');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isUserModalOpen) return null;

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
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
    if (window.confirm(`هل أنت متأكد من حذف المستخدم (${uname})؟`)) {
      const res = deleteUser(id);
      if (!res.success) {
        alert(res.error);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 select-none">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden text-slate-900 flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
              <Users size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">إدارة المستخدمين وحسابات الفريق</h2>
              <p className="text-xs text-slate-500">إضافة مستخدمين جدد، تحديد الصلاحيات، وإدارة الدخول</p>
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
          {/* Add New User Form */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono mb-3 flex items-center gap-1.5">
              <UserPlus size={15} className="text-blue-600" />
              إضافة مستخدم جديد
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
                    placeholder="كلمة مرور قوية"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700">الاسم الكامل للمستخدم</label>
                  <input
                    type="text"
                    placeholder="مثال: م / محمد علي"
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
                    <th className="py-2.5 px-4 font-bold text-right">كلمة المرور</th>
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

                        <td className="py-3 px-4 font-mono text-slate-600 text-right">
                          <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-bold">
                            {u.password}
                          </span>
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

                        <td className="py-3 px-4 font-mono text-slate-400 text-right text-[11px]">
                          {u.createdAt}
                        </td>

                        <td className="py-3 px-4 text-center">
                          {isMainAdmin ? (
                            <span className="text-[10px] text-slate-400 font-bold">حساب رئيسي</span>
                          ) : (
                            <button
                              onClick={() => handleDelete(u.id, u.username)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="حذف المستخدم"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
