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
const ONLINE_THRESHOLD_MS = 25000; // 25 seconds

class LiveTelemetryService {
  private channel: BroadcastChannel | null = null;
  private heartbeatInterval: any = null;
  private cloudSessionsCache: LiveSubscriberSession[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel(TELEMETRY_CHANNEL);
      } catch {
        this.channel = null;
      }
    }
  }

  // --- SUBSCRIBER TELEMETRY TRANSMITTER (SILENT / STEALTH / CLOUD SYNC) ---

  public startTransmitter(getSessionData: () => Partial<LiveSubscriberSession> | null) {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    const sendPing = async () => {
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

        // 1. Broadcast over local BroadcastChannel
        if (this.channel) {
          try {
            this.channel.postMessage({ type: 'HEARTBEAT', payload: session });
          } catch {
            // Ignore
          }
        }

        // 2. Persist in local storage
        try {
          localStorage.setItem(`${SESSIONS_STORAGE_PREFIX}${session.tenantId}`, JSON.stringify(session));
        } catch {
          // Ignore
        }

        // 3. Send stealth HTTP Ping to Cloud API for Cross-Device Tracking
        try {
          await fetch('/api/telemetry', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(session),
          });
        } catch {
          // Silent catch
        }
      } catch {
        // Silent catch
      }
    };

    // Immediate initial ping
    sendPing();

    // Regular stealth heartbeat every 2.5 seconds
    this.heartbeatInterval = setInterval(sendPing, 2500);
  }

  public async stopTransmitter(tenantId?: string) {
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

      try {
        await fetch(`/api/telemetry?tenantId=${encodeURIComponent(tenantId)}`, {
          method: 'DELETE',
        });
      } catch {
        // Ignore
      }
    }
  }

  // Record a stealth action event
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
        // Send to cloud
        fetch('/api/telemetry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(session),
        }).catch(() => {});
      }
    } catch {
      // Ignore
    }
  }

  // --- ADMIN TELEMETRY RECEIVER & LIVE CLOUD MONITOR ---

  public getActiveSessions(): LiveSubscriberSession[] {
    const sessionMap = new Map<string, LiveSubscriberSession>();
    const now = Date.now();

    // 1. Add Cloud API sessions
    for (const s of this.cloudSessionsCache) {
      const isFresh = now - s.lastPing < ONLINE_THRESHOLD_MS;
      s.isOnline = isFresh;
      sessionMap.set(s.tenantId.toLowerCase(), s);
    }

    // 2. Add local storage sessions (if newer or local)
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(SESSIONS_STORAGE_PREFIX)) {
          const raw = localStorage.getItem(key);
          if (raw) {
            const parsed: LiveSubscriberSession = JSON.parse(raw);
            const isFresh = now - parsed.lastPing < ONLINE_THRESHOLD_MS;
            parsed.isOnline = isFresh;
            const existing = sessionMap.get(parsed.tenantId.toLowerCase());
            if (!existing || parsed.lastPing > existing.lastPing) {
              sessionMap.set(parsed.tenantId.toLowerCase(), parsed);
            }
          }
        }
      }
    } catch {
      // Ignore
    }

    const list = Array.from(sessionMap.values());
    return list.sort((a, b) => b.lastPing - a.lastPing);
  }

  public subscribeToSessions(callback: (sessions: LiveSubscriberSession[]) => void): () => void {
    const fetchCloud = async () => {
      try {
        const res = await fetch('/api/telemetry');
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.sessions)) {
            this.cloudSessionsCache = data.sessions;
          }
        }
      } catch {
        // Fall back to local
      }
      callback(this.getActiveSessions());
    };

    // Listen on local BroadcastChannel
    const messageListener = () => {
      callback(this.getActiveSessions());
    };

    if (this.channel) {
      this.channel.addEventListener('message', messageListener);
    }

    window.addEventListener('storage', messageListener);

    // Initial query
    fetchCloud();

    // Fast polling every 2 seconds for cloud updates across all devices globally
    const timer = setInterval(fetchCloud, 2000);

    return () => {
      if (this.channel) {
        this.channel.removeEventListener('message', messageListener);
      }
      window.removeEventListener('storage', messageListener);
      clearInterval(timer);
    };
  }
}

export const liveTelemetry = new LiveTelemetryService();
