import { create } from 'zustand';

export interface UserAccount {
  id: string;
  username: string;
  password: string;
  name: string;
  role: 'admin' | 'designer' | 'workshop';
  createdAt: string;
}

interface AuthState {
  currentUser: UserAccount | null;
  users: UserAccount[];
  isAuthenticated: boolean;
  isUserModalOpen: boolean;

  login: (username: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  addUser: (user: Omit<UserAccount, 'id' | 'createdAt'>) => { success: boolean; error?: string };
  deleteUser: (id: string) => { success: boolean; error?: string };
  setIsUserModalOpen: (open: boolean) => void;
}

const USERS_STORAGE_KEY = 'kitchan_users_v1';
const SESSION_STORAGE_KEY = 'kitchan_auth_session_v1';

const DEFAULT_ADMIN: UserAccount = {
  id: 'usr-admin',
  username: 'admin',
  password: 'Germen@600',
  name: 'المدير العام',
  role: 'admin',
  createdAt: '2026-08-27',
};

function loadUsers(): UserAccount[] {
  try {
    const saved = localStorage.getItem(USERS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure default admin always exists
        if (!parsed.some((u: UserAccount) => u.username.toLowerCase() === 'admin')) {
          parsed.unshift(DEFAULT_ADMIN);
        }
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load users:', e);
  }
  return [DEFAULT_ADMIN];
}

function loadSession(users: UserAccount[]): UserAccount | null {
  try {
    const saved = localStorage.getItem(SESSION_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const matched = users.find(u => u.id === parsed.id && u.username === parsed.username);
      if (matched) return matched;
    }
  } catch (e) {
    console.error('Failed to load session:', e);
  }
  return null;
}

export const useAuthStore = create<AuthState>((set, get) => {
  const initialUsers = loadUsers();
  const initialSession = loadSession(initialUsers);

  return {
    currentUser: initialSession,
    users: initialUsers,
    isAuthenticated: initialSession !== null,
    isUserModalOpen: false,

    login: (username, password) => {
      const cleanUser = username.trim();
      const matched = get().users.find(
        (u) => u.username.toLowerCase() === cleanUser.toLowerCase() && u.password === password
      );

      if (matched) {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ id: matched.id, username: matched.username }));
        set({ currentUser: matched, isAuthenticated: true });
        return { success: true };
      }

      return { success: false, error: 'اسم المستخدم أو كلمة المرور غير صحيحة' };
    },

    logout: () => {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      set({ currentUser: null, isAuthenticated: false, isUserModalOpen: false });
    },

    addUser: (userData) => {
      const cleanUser = userData.username.trim();
      if (!cleanUser || !userData.password) {
        return { success: false, error: 'يرجى إدخال اسم المستخدم وكلمة المرور' };
      }

      const exists = get().users.some(
        (u) => u.username.toLowerCase() === cleanUser.toLowerCase()
      );

      if (exists) {
        return { success: false, error: 'اسم المستخدم مسجل مسبقاً، اختر اسماً آخر' };
      }

      const newUser: UserAccount = {
        id: `usr-${Date.now()}`,
        username: cleanUser,
        password: userData.password,
        name: userData.name.trim() || cleanUser,
        role: userData.role,
        createdAt: new Date().toISOString().split('T')[0],
      };

      const updatedUsers = [...get().users, newUser];
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
      set({ users: updatedUsers });
      return { success: true };
    },

    deleteUser: (id) => {
      const user = get().users.find((u) => u.id === id);
      if (!user) return { success: false, error: 'المستخدم غير موجود' };
      if (user.username.toLowerCase() === 'admin') {
        return { success: false, error: 'لا يمكن حذف حساب المدير العام الأساسي' };
      }

      const updatedUsers = get().users.filter((u) => u.id !== id);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
      set({ users: updatedUsers });
      return { success: true };
    },

    setIsUserModalOpen: (open) => set({ isUserModalOpen: open }),
  };
});
