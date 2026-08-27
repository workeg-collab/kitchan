import { CompanyTenant, StoredProjectRecord } from '../types/subscription';
import { ProjectData } from '../types';

const DB_NAME = 'FurnitureCAD_Enterprise_DB';
const DB_VERSION = 1;
const TENANTS_STORE = 'tenants';
const PROJECTS_STORE = 'projects';
const LOCAL_TENANTS_KEY = 'fc_tenants_v2';
const LOCAL_PROJECTS_KEY = 'fc_projects_v2';

// Default Demo Companies / Subscriptions
const DEFAULT_TENANTS: CompanyTenant[] = [
  {
    id: 'tenant-demo-01',
    companyName: 'شركة النور للمطابخ والديكور',
    contactPerson: 'م / حسام النور',
    phone: '01012345678',
    email: 'info@alnoor-kitchens.com',
    username: 'alnoor',
    password: 'Alnoor@2026',
    plan: 'yearly',
    status: 'active',
    startDate: '2026-01-01',
    expiryDate: '2027-01-01',
    maxProjects: 9999,
    allowedModules: ['kitchen', 'dressing', 'bedroom', 'library'],
    notes: 'اشتراك سنوي باقة الشركات الكاملة',
    createdAt: '2026-01-01',
  },
  {
    id: 'tenant-demo-02',
    companyName: 'مصنع الأندلس للأثاث المودرن',
    contactPerson: 'أ / إبراهيم الأندلسي',
    phone: '01198765432',
    email: 'andalus@furniture.com',
    username: 'andalus',
    password: 'Andalus@2026',
    plan: 'monthly',
    status: 'active',
    startDate: '2026-08-01',
    expiryDate: '2026-09-01',
    maxProjects: 100,
    allowedModules: ['kitchen', 'dressing'],
    notes: 'اشتراك شهري قابل للتجديد',
    createdAt: '2026-08-01',
  },
];

class DatabaseService {
  private db: IDBDatabase | null = null;
  private isOpening = false;

  private async openDB(): Promise<IDBDatabase | null> {
    if (this.db) return this.db;
    if (typeof indexedDB === 'undefined') return null;

    return new Promise((resolve) => {
      try {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event: any) => {
          try {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(TENANTS_STORE)) {
              db.createObjectStore(TENANTS_STORE, { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains(PROJECTS_STORE)) {
              const projStore = db.createObjectStore(PROJECTS_STORE, { keyPath: 'id' });
              projStore.createIndex('tenantId', 'tenantId', { unique: false });
            }
          } catch {
            // Ignore upgrade errors
          }
        };

        request.onsuccess = (event: any) => {
          this.db = event.target.result;
          resolve(this.db);
        };

        request.onerror = () => {
          resolve(null);
        };

        request.onblocked = () => {
          resolve(null);
        };
      } catch {
        resolve(null);
      }
    });
  }

  // --- TENANTS / COMPANIES MANAGEMENT ---

  private getLocalTenants(): CompanyTenant[] {
    try {
      const saved = localStorage.getItem(LOCAL_TENANTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    // Initialize with default demo tenants
    localStorage.setItem(LOCAL_TENANTS_KEY, JSON.stringify(DEFAULT_TENANTS));
    return DEFAULT_TENANTS;
  }

  private saveLocalTenants(tenants: CompanyTenant[]): void {
    try {
      localStorage.setItem(LOCAL_TENANTS_KEY, JSON.stringify(tenants));
    } catch {
      // Ignore storage quota errors
    }
  }

  async getAllTenants(): Promise<CompanyTenant[]> {
    const localList = this.getLocalTenants();

    // Async background sync with IndexedDB
    try {
      const db = await this.openDB();
      if (db) {
        const tx = db.transaction(TENANTS_STORE, 'readonly');
        const store = tx.objectStore(TENANTS_STORE);
        const req = store.getAll();
        return new Promise((resolve) => {
          req.onsuccess = () => {
            const idbTenants = req.result || [];
            if (idbTenants.length > localList.length) {
              this.saveLocalTenants(idbTenants);
              resolve(idbTenants);
            } else {
              resolve(localList);
            }
          };
          req.onerror = () => resolve(localList);
        });
      }
    } catch {
      // Return local cache on any error
    }

    return localList;
  }

  async saveTenant(tenant: CompanyTenant): Promise<void> {
    // 1. Synchronously save to localStorage
    const current = this.getLocalTenants();
    const updated = [...current.filter((t) => t.id !== tenant.id), tenant];
    this.saveLocalTenants(updated);

    // 2. Asynchronously save to IndexedDB
    try {
      const db = await this.openDB();
      if (db) {
        const tx = db.transaction(TENANTS_STORE, 'readwrite');
        tx.objectStore(TENANTS_STORE).put(tenant);
      }
    } catch (e) {
      console.warn('Could not save tenant to IndexedDB:', e);
    }
  }

  async deleteTenant(id: string): Promise<void> {
    const current = this.getLocalTenants();
    const updated = current.filter((t) => t.id !== id);
    this.saveLocalTenants(updated);

    try {
      const db = await this.openDB();
      if (db) {
        const tx = db.transaction(TENANTS_STORE, 'readwrite');
        tx.objectStore(TENANTS_STORE).delete(id);
      }
    } catch (e) {
      console.warn('Could not delete tenant from IndexedDB:', e);
    }
  }

  async findTenantByUsername(username: string): Promise<CompanyTenant | null> {
    if (!username) return null;
    const clean = username.trim().toLowerCase();

    // Check local storage immediately (zero lag, 0ms)
    const local = this.getLocalTenants();
    const match = local.find((t) => t.username.toLowerCase() === clean);
    if (match) return match;

    // Check IndexedDB
    try {
      const all = await this.getAllTenants();
      return all.find((t) => t.username.toLowerCase() === clean) || null;
    } catch {
      return null;
    }
  }

  // --- PROJECTS MULTI-TENANT STORAGE ---

  async saveProjectForTenant(tenantId: string, projectData: ProjectData): Promise<void> {
    const record: StoredProjectRecord = {
      id: projectData.metadata.id,
      tenantId: tenantId || 'admin',
      projectName: projectData.metadata.name,
      projectType: projectData.metadata.projectType,
      clientName: projectData.metadata.clientName,
      updatedAt: new Date().toISOString(),
      data: projectData,
    };

    // Save in LocalStorage
    try {
      const storageKey = `fc_proj_${tenantId}_${projectData.metadata.id}`;
      localStorage.setItem(storageKey, JSON.stringify(record));
    } catch {
      // Storage quota
    }

    // Save in IndexedDB
    try {
      const db = await this.openDB();
      if (db) {
        const tx = db.transaction(PROJECTS_STORE, 'readwrite');
        tx.objectStore(PROJECTS_STORE).put(record);
      }
    } catch (e) {
      console.warn('Error saving project to IndexedDB:', e);
    }
  }

  async getProjectsForTenant(tenantId: string): Promise<StoredProjectRecord[]> {
    const localProjects: StoredProjectRecord[] = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`fc_proj_`)) {
          const item = localStorage.getItem(key);
          if (item) {
            const parsed = JSON.parse(item);
            if (tenantId === 'admin' || parsed.tenantId === tenantId) {
              localProjects.push(parsed);
            }
          }
        }
      }
    } catch {
      // Ignore
    }

    try {
      const db = await this.openDB();
      if (db) {
        const tx = db.transaction(PROJECTS_STORE, 'readonly');
        const store = tx.objectStore(PROJECTS_STORE);
        const req = store.getAll();
        return new Promise((resolve) => {
          req.onsuccess = () => {
            const all: StoredProjectRecord[] = req.result || [];
            const filtered = tenantId === 'admin' ? all : all.filter((p) => p.tenantId === tenantId);
            resolve(filtered.length > 0 ? filtered : localProjects);
          };
          req.onerror = () => resolve(localProjects);
        });
      }
    } catch {
      // Ignore
    }

    return localProjects;
  }

  async deleteProject(id: string): Promise<void> {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.includes(id)) {
          localStorage.removeItem(key);
        }
      }
    } catch {
      // Ignore
    }

    try {
      const db = await this.openDB();
      if (db) {
        const tx = db.transaction(PROJECTS_STORE, 'readwrite');
        tx.objectStore(PROJECTS_STORE).delete(id);
      }
    } catch (e) {
      console.warn('Error deleting project from IndexedDB:', e);
    }
  }
}

export const dbService = new DatabaseService();
