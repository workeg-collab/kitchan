import { ProjectType } from './index';

export type SubscriptionPlan = 'monthly' | 'yearly' | 'trial' | 'lifetime';
export type SubscriptionStatus = 'active' | 'expired' | 'suspended';

export interface CompanyTenant {
  id: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  username: string;
  password: string; // Stored securely
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: string; // ISO string or YYYY-MM-DD
  expiryDate: string; // ISO string or YYYY-MM-DD
  maxProjects: number; // e.g. 50 or 9999 for unlimited
  allowedModules: ProjectType[];
  notes?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface StoredProjectRecord {
  id: string;
  tenantId: string;
  projectName: string;
  projectType: ProjectType;
  clientName: string;
  updatedAt: string;
  data: any; // Full ProjectData JSON
}
