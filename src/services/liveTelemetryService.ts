import { ProjectType } from '../types';

export interface LiveSubscriberSession {
  tenantId: string;
  username: string;
  companyName: string;
  contactPerson: string;
  plan: string;
  lastPing: number; // Unix timestamp
  isOnline: boolean;
  activeModule: ProjectType;
  activeTab: string;
  projectName: string;
  clientName: string;
  cabinetCount: number;
  roomDimensions: { width: number; length: number; height: number };
  selectedCabinetName?: string;
  lastAction: string;
  snapshotCabinets: Array<{
    id: string;
    name: string;
    x: number;
    y: number;
    z: number;
    width: number;
    height: number;
    depth: number;
    rotation: number;
    category: string;
  }>;
}

const TELEMETRY_CHANNEL = 'fc_live_telemetry_channel_v1';
const SESSIONS_STORAGE_PREFIX = 'fc_live_session_';
const ONLINE_THRESHOLD_MS = 15000; // 15 seconds without ping = offline

class LiveTelemetryService {
  private channel: BroadcastChannel | null = null;
  private heartbeatInterval: any = null;

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel(TELEMETRY_CHANNEL);
      } catch {
        this.channel = null;
      }
    }
  }

  // --- SUBSCRIBER TELEMETRY TRANSMITTER (SILENT / STEALTH) ---

  public startTransmitter(getSessionData: () => Partial<LiveSubscriberSession> | null) {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    const sendPing = () => {
      try {
        const raw = getSessionData();
        if (!raw || !raw.tenantId || raw.tenantId === 'admin') return;

        const session: LiveSubscriberSession = {
          tenantId: raw.tenantId,
          username: raw.username || raw.tenantId,
          companyName: raw.companyName || raw.username || 'مشترك',
          contactPerson: raw.contactPerson || '',
          plan: raw.plan || 'trial',
          lastPing: Date.now(),
          isOnline: true,
          activeModule: raw.activeModule || 'kitchen',
          activeTab: raw.activeTab || '2d-plan',
          projectName: raw.projectName || 'مشروع جديد',
          clientName: raw.clientName || '',
          cabinetCount: raw.cabinetCount || 0,
          roomDimensions: raw.roomDimensions || { width: 4000, length: 3000, height: 2600 },
          selectedCabinetName: raw.selectedCabinetName,
          lastAction: raw.lastAction || 'تصفح ساحة العمل',
          snapshotCabinets: raw.snapshotCabinets || [],
        };

        // 1. Broadcast over channel
        if (this.channel) {
          this.channel.postMessage({ type: 'HEARTBEAT', payload: session });
        }

        // 2. Persist in local storage
        localStorage.setItem(`${SESSIONS_STORAGE_PREFIX}${session.tenantId}`, JSON.stringify(session));
      } catch {
        // Silent error handling
      }
    };

    // Immediate initial ping
    sendPing();

    // Regular stealth heartbeat every 3 seconds
    this.heartbeatInterval = setInterval(sendPing, 3000);
  }

  public stopTransmitter(tenantId?: string) {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    if (tenantId) {
      try {
        const stored = localStorage.getItem(`${SESSIONS_STORAGE_PREFIX}${tenantId}`);
        if (stored) {
          const parsed: LiveSubscriberSession = JSON.parse(stored);
          parsed.isOnline = false;
          parsed.lastPing = Date.now() - ONLINE_THRESHOLD_MS - 1000;
          localStorage.setItem(`${SESSIONS_STORAGE_PREFIX}${tenantId}`, JSON.stringify(parsed));
          if (this.channel) {
            this.channel.postMessage({ type: 'LOGOUT', payload: { tenantId } });
          }
        }
      } catch {
        // Ignore
      }
    }
  }

  // Record a stealth action event (e.g. "أضاف وحدة سفلية 60 سم", "غيّر الارتفاع")
  public recordAction(tenantId: string, action: string) {
    try {
      if (!tenantId || tenantId === 'admin') return;
      const key = `${SESSIONS_STORAGE_PREFIX}${tenantId}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        const session: LiveSubscriberSession = JSON.parse(stored);
        session.lastAction = action;
        session.lastPing = Date.now();
        localStorage.setItem(key, JSON.stringify(session));
        if (this.channel) {
          this.channel.postMessage({ type: 'HEARTBEAT', payload: session });
        }
      }
    } catch {
      // Ignore
    }
  }

  // --- ADMIN TELEMETRY RECEIVER & LIVE MONITOR ---

  public getActiveSessions(): LiveSubscriberSession[] {
    const sessions: LiveSubscriberSession[] = [];
    const now = Date.now();

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(SESSIONS_STORAGE_PREFIX)) {
          const raw = localStorage.getItem(key);
          if (raw) {
            const parsed: LiveSubscriberSession = JSON.parse(raw);
            const isFresh = now - parsed.lastPing < ONLINE_THRESHOLD_MS;
            parsed.isOnline = isFresh;
            sessions.push(parsed);
          }
        }
      }
    } catch {
      // Ignore
    }

    return sessions.sort((a, b) => b.lastPing - a.lastPing);
  }

  public subscribeToSessions(callback: (sessions: LiveSubscriberSession[]) => void): () => void {
    const handleUpdate = () => {
      callback(this.getActiveSessions());
    };

    // Listen on BroadcastChannel
    const messageListener = () => {
      handleUpdate();
    };

    if (this.channel) {
      this.channel.addEventListener('message', messageListener);
    }

    // Also listen to storage events
    window.addEventListener('storage', handleUpdate);

    // Initial query
    handleUpdate();

    // Auto-refresh timer to mark inactive sessions
    const timer = setInterval(handleUpdate, 3000);

    return () => {
      if (this.channel) {
        this.channel.removeEventListener('message', messageListener);
      }
      window.removeEventListener('storage', handleUpdate);
      clearInterval(timer);
    };
  }
}

export const liveTelemetry = new LiveTelemetryService();
