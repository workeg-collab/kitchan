interface LiveSubscriberSession {
  tenantId: string;
  username: string;
  companyName: string;
  contactPerson: string;
  plan: string;
  lastPing: number;
  isOnline: boolean;
  activeModule: string;
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

// In-Memory Cloud Session Store across Edge Instances
const globalStore = (globalThis as any).__FC_GLOBAL_SESSIONS__ || new Map<string, LiveSubscriberSession>();
(globalThis as any).__FC_GLOBAL_SESSIONS__ = globalStore;

const TIMEOUT_MS = 25000; // 25 seconds before marking inactive

export default async function handler(req: any, res: any) {
  // Enable CORS for cross-device access
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const now = Date.now();

  // POST: Subscriber Heartbeat Update
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const session = body as LiveSubscriberSession;
      if (session && session.tenantId && session.tenantId !== 'admin') {
        session.lastPing = now;
        session.isOnline = true;
        globalStore.set(session.tenantId.toLowerCase(), session);
      }

      // Cleanup stale sessions
      for (const [key, val] of globalStore.entries()) {
        if (now - val.lastPing > TIMEOUT_MS * 2) {
          globalStore.delete(key);
        }
      }

      return res.status(200).json({ success: true, count: globalStore.size });
    } catch (e: any) {
      return res.status(400).json({ error: e?.message || 'Invalid payload' });
    }
  }

  // DELETE: Logout
  if (req.method === 'DELETE') {
    try {
      const { tenantId } = req.query || {};
      if (tenantId && typeof tenantId === 'string') {
        globalStore.delete(tenantId.toLowerCase());
      }
      return res.status(200).json({ success: true });
    } catch (e: any) {
      return res.status(400).json({ error: e?.message });
    }
  }

  // GET: Admin Fetch All Active Sessions
  const activeSessions: LiveSubscriberSession[] = [];
  for (const session of globalStore.values()) {
    const isFresh = now - session.lastPing < TIMEOUT_MS;
    session.isOnline = isFresh;
    activeSessions.push(session);
  }

  // Sort by most recently active
  activeSessions.sort((a, b) => b.lastPing - a.lastPing);

  return res.status(200).json({
    timestamp: now,
    activeCount: activeSessions.filter((s) => s.isOnline).length,
    sessions: activeSessions,
  });
}
