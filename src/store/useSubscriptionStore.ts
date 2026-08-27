import { create } from 'zustand';
import { CompanyTenant, SubscriptionPlan, SubscriptionStatus } from '../types/subscription';
import { dbService } from '../services/dbService';

interface SubscriptionState {
  tenants: CompanyTenant[];
  isLoading: boolean;
  activeTenant: CompanyTenant | null; // The logged-in company (if not super admin)
  isAdminModalOpen: boolean;

  fetchTenants: () => Promise<void>;
  createTenant: (tenantData: Omit<CompanyTenant, 'id' | 'createdAt'>) => Promise<CompanyTenant>;
  updateTenant: (id: string, data: Partial<CompanyTenant>) => Promise<void>;
  renewSubscription: (id: string, plan: SubscriptionPlan, durationMonths: number) => Promise<void>;
  toggleTenantStatus: (id: string) => Promise<void>;
  deleteTenant: (id: string) => Promise<void>;
  setActiveTenant: (tenant: CompanyTenant | null) => void;
  setIsAdminModalOpen: (open: boolean) => void;

  checkSubscriptionValid: (tenant: CompanyTenant) => { isValid: boolean; reason?: string; daysRemaining: number };
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  tenants: [],
  isLoading: false,
  activeTenant: null,
  isAdminModalOpen: false,

  fetchTenants: async () => {
    set({ isLoading: true });
    const tenants = await dbService.getAllTenants();
    set({ tenants, isLoading: false });
  },

  createTenant: async (tenantData) => {
    const id = `tenant-${Date.now()}`;
    const newTenant: CompanyTenant = {
      ...tenantData,
      id,
      createdAt: new Date().toISOString().split('T')[0],
    };
    await dbService.saveTenant(newTenant);
    await get().fetchTenants();
    return newTenant;
  },

  updateTenant: async (id, data) => {
    const tenant = get().tenants.find((t) => t.id === id);
    if (!tenant) return;
    const updated = { ...tenant, ...data };
    await dbService.saveTenant(updated);
    await get().fetchTenants();
  },

  renewSubscription: async (id, plan, durationMonths) => {
    const tenant = get().tenants.find((t) => t.id === id);
    if (!tenant) return;

    const currentExpiry = new Date(tenant.expiryDate > new Date().toISOString() ? tenant.expiryDate : new Date());
    currentExpiry.setMonth(currentExpiry.getMonth() + durationMonths);
    const newExpiryStr = currentExpiry.toISOString().split('T')[0];

    const updated: CompanyTenant = {
      ...tenant,
      plan,
      status: 'active',
      expiryDate: newExpiryStr,
    };

    await dbService.saveTenant(updated);
    await get().fetchTenants();
  },

  toggleTenantStatus: async (id) => {
    const tenant = get().tenants.find((t) => t.id === id);
    if (!tenant) return;
    const newStatus: SubscriptionStatus = tenant.status === 'active' ? 'suspended' : 'active';
    await dbService.saveTenant({ ...tenant, status: newStatus });
    await get().fetchTenants();
  },

  deleteTenant: async (id) => {
    await dbService.deleteTenant(id);
    await get().fetchTenants();
  },

  setActiveTenant: (activeTenant) => set({ activeTenant }),
  setIsAdminModalOpen: (isAdminModalOpen) => set({ isAdminModalOpen }),

  checkSubscriptionValid: (tenant: CompanyTenant) => {
    if (tenant.status === 'suspended') {
      return { isValid: false, reason: 'تم إيقاف حساب الشركة مؤقتاً من قبل الإدارة', daysRemaining: 0 };
    }

    const now = new Date();
    const expiry = new Date(tenant.expiryDate);
    const diffTime = expiry.getTime() - now.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (daysRemaining < 0) {
      return { isValid: false, reason: 'انتهت فترة الاشتراك المحددة. يرجى تجديد الاشتراك للمتابعة.', daysRemaining: 0 };
    }

    return { isValid: true, daysRemaining };
  },
}));
