import { CompanyTenant, StoredProjectRecord } from '../types/subscription';
import { ProjectData } from '../types';

const DB_NAME = 'FurnitureCAD_Enterprise_DB';
const DB_VERSION = 1;
const TENANTS_STORE = 'tenants';
const PROJECTS_STORE = 'projects';

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
  private isInitialized = false;

  private async openDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(TENANTS_STORE)) {
          db.createObjectStore(TENANTS_STORE, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(PROJECTS_STORE)) {
          const projStore = db.createObjectStore(PROJECTS_STORE, { keyPath: 'id' });
          projStore.createIndex('tenantId', 'tenantId', { unique: false });
        }
      };

      request.onsuccess = (event: any) => {
        this.db = event.target.result;
        this.isInitialized = true;
        this.seedInitialData();
        resolve(this.db!);
      };

      request.onerror = (event: any) => {
        console.error('IndexedDB error:', event.target.error);
        reject(event.target.error);
      };
    });
  }

  private async seedInitialData() {
    const tenants = await this.getAllTenants();
    if (tenants.length === 0) {
      for (const t of DEFAULT_TENANTS) {
        await this.saveTenant(t);
      }
    }
  }

  // --- TENANTS / COMPANIES MANAGEMENT ---

  async getAllTenants(): Promise<CompanyTenant[]> {
    try {
      const db = await this.openDB();
      return new Promise((resolve) => {
        const tx = db.transaction(TENANTS_STORE, 'readonly');
        const store = tx.objectStore(TENANTS_STORE);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      });
    } catch {
      return JSON.parse(localStorage.getItem('fc_tenants') || JSON.stringify(DEFAULT_TENANTS));
    }
  }

  async saveTenant(tenant: CompanyTenant): Promise<void> {
    try {
      const db = await this.openDB();
      const tx = db.transaction(TENANTS_STORE, 'readwrite');
      tx.objectStore(TENANTS_STORE).put(tenant);
    } catch (e) {
      console.error('Error saving tenant:', e);
    }
    // Backup in localStorage
    const current = await this.getAllTenants();
    const updated = [...current.filter(t => t.id !== tenant.id), tenant];
    localStorage.setItem('fc_tenants', JSON.stringify(updated));
  }

  async deleteTenant(id: string): Promise<void> {
    try {
      const db = await this.openDB();
      const tx = db.transaction(TENANTS_STORE, 'readwrite');
      tx.objectStore(TENANTS_STORE).delete(id);
    } catch (e) {
      console.error('Error deleting tenant:', e);
    }
  }

  async findTenantByUsername(username: string): Promise<CompanyTenant | null> {
    const tenants = await this.getAllTenants();
    return tenants.find(t => t.username.toLowerCase() === username.toLowerCase()) || null;
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

    try {
      const db = await this.openDB();
      const tx = db.transaction(PROJECTS_STORE, 'readwrite');
      tx.objectStore(PROJECTS_STORE).put(record);
    } catch (e) {
      console.error('Error saving project to IndexedDB:', e);
    }

    // Secondary backup
    const storageKey = `fc_proj_${tenantId}_${projectData.metadata.id}`;
    localStorage.setItem(storageKey, JSON.stringify(record));
  }

  async getProjectsForTenant(tenantId: string): Promise<StoredProjectRecord[]> {
    try {
      const db = await this.openDB();
      return new Promise((resolve) => {
        const tx = db.transaction(PROJECTS_STORE, 'readonly');
        const store = tx.objectStore(PROJECTS_STORE);
        const req = store.getAll();
        req.onsuccess = () => {
          const all: StoredProjectRecord[] = req.result || [];
          if (tenantId === 'admin') {
            resolve(all);
          } else {
            resolve(all.filter(p => p.tenantId === tenantId));
          }
        };
        req.onerror = () => resolve([]);
      });
    } catch {
      return [];
    }
  }

  async deleteProject(id: string): Promise<void> {
    try {
      const db = await this.openDB();
      const tx = db.transaction(PROJECTS_STORE, 'readwrite');
      tx.objectStore(PROJECTS_STORE).delete(id);
    } catch (e) {
      console.error('Error deleting project:', e);
    }
  }
}

export const dbService = new DatabaseService();
