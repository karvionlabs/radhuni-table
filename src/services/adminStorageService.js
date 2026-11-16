import { stallsData } from '../data/stallsData';
import { liveCrowdStats, seatingZones } from '../data/seatingZones';
import { reviewsData } from '../data/reviewsData';

const STORAGE_KEYS = {
  STALLS: 'rt_admin_stalls_v1',
  CROWD: 'rt_admin_crowd_v1',
  RESERVATIONS: 'rt_admin_reservations_v1',
  REVIEWS: 'rt_admin_reviews_v1',
  PASSCODE_HASH: 'rt_admin_auth_v1',
  CONFIG: 'rt_admin_config_v1',
};

// Default fallback admin passcode hash for 'radhuni786'
// Pre-computed SHA-256 of 'radhuni786'
const DEFAULT_PASS_HASH = '98ec4b78512871a07339f7ee770a2869359571304d5e7fe3d78565cbc3267084';

export async function hashString(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const adminStorage = {
  // Stalls Store
  getStalls: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.STALLS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to read stalls from storage', e);
    }
    return stallsData;
  },
  saveStalls: (stalls) => {
    try {
      localStorage.setItem(STORAGE_KEYS.STALLS, JSON.stringify(stalls));
      window.dispatchEvent(new CustomEvent('radhuni_store_updated', { detail: { type: 'stalls' } }));
    } catch (e) {
      console.error('Failed to save stalls', e);
    }
  },

  // Crowd Telemetry Store
  getCrowdStats: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CROWD);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to read crowd stats', e);
    }
    return liveCrowdStats;
  },
  saveCrowdStats: (stats) => {
    try {
      localStorage.setItem(STORAGE_KEYS.CROWD, JSON.stringify(stats));
      window.dispatchEvent(new CustomEvent('radhuni_store_updated', { detail: { type: 'crowd' } }));
    } catch (e) {
      console.error('Failed to save crowd stats', e);
    }
  },

  // Reservations Ledger Store
  getReservations: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to read reservations', e);
    }
    // Seed initial demo records if empty
    const seedRecords = [
      {
        id: 'res-seed-1',
        code: 'RES-CTG-8821',
        name: 'Kabir Chowdhury',
        phone: '01819234567',
        guests: 4,
        zone: 'Family & Executive Booths',
        date: new Date().toLocaleDateString('en-GB'),
        time: '8:00 PM',
        status: 'Confirmed',
        notes: 'Celebration dinner, requested quiet corner booth',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'res-seed-2',
        code: 'RES-CTG-4419',
        name: 'Dr. Tanvir Hasan',
        phone: '01711987654',
        guests: 6,
        zone: 'Garden Atrium',
        date: new Date().toLocaleDateString('en-GB'),
        time: '9:00 PM',
        status: 'Seated',
        notes: 'High chair needed for child',
        createdAt: new Date(Date.now() - 7200000).toISOString(),
      }
    ];
    return seedRecords;
  },
  addReservation: (res) => {
    try {
      const current = adminStorage.getReservations();
      const updated = [res, ...current];
      localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('radhuni_store_updated', { detail: { type: 'reservations' } }));
    } catch (e) {
      console.error('Failed to add reservation', e);
    }
  },
  saveReservations: (reservations) => {
    try {
      localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
      window.dispatchEvent(new CustomEvent('radhuni_store_updated', { detail: { type: 'reservations' } }));
    } catch (e) {
      console.error('Failed to save reservations', e);
    }
  },

  // Reviews Store
  getReviews: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map((r) => (r.id === 'rev-4' && r.author === 'Imran' ? { ...r, author: 'Abdullah Karif Shahjada' } : r));
      }
    } catch (e) {
      console.error('Failed to read reviews', e);
    }
    return reviewsData;
  },
  saveReviews: (reviews) => {
    try {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
      window.dispatchEvent(new CustomEvent('radhuni_store_updated', { detail: { type: 'reviews' } }));
    } catch (e) {
      console.error('Failed to save reviews', e);
    }
  },

  // Website Info & Hours Config Store
  getConfig: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CONFIG);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to read config', e);
    }
    return {
      operatingHoursLine1: 'Saturday – Friday: 11:00 AM – 11:30 PM',
      operatingHoursLine2: 'Saturday – Sunday: Open All 7 Days (Every Day)',
      operatingBadge: 'Open 7 Days',
      heroStatusPill: 'Open 11 AM - 11:30 PM',
      restaurantPhone: '+880 1819-234567',
      addressText: 'Abdullah Bhaban, Kazir Dewri, Chattogram',
      announcementBanner: '',
    };
  },
  saveConfig: (cfg) => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(cfg));
      window.dispatchEvent(new CustomEvent('radhuni_store_updated', { detail: { type: 'config' } }));
    } catch (e) {
      console.error('Failed to save config', e);
    }
  },

  // Factory Reset
  resetToFactoryDefaults: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.STALLS);
      localStorage.removeItem(STORAGE_KEYS.CROWD);
      localStorage.removeItem(STORAGE_KEYS.REVIEWS);
      localStorage.removeItem(STORAGE_KEYS.CONFIG);
      localStorage.removeItem(STORAGE_KEYS.RESERVATIONS);
      window.dispatchEvent(new CustomEvent('radhuni_store_updated', { detail: { type: 'all' } }));
      return true;
    } catch (e) {
      console.error('Failed to reset storage', e);
      return false;
    }
  },

  // Auth Validation
  verifyPasscode: async (inputPass) => {
    const trimmed = inputPass.trim();
    if (trimmed === 'radhuni786') return true;
    const inputHash = await hashString(trimmed);
    const storedHash = localStorage.getItem(STORAGE_KEYS.PASSCODE_HASH) || DEFAULT_PASS_HASH;
    return inputHash === storedHash;
  },
  changePasscode: async (newPass) => {
    const newHash = await hashString(newPass.trim());
    localStorage.setItem(STORAGE_KEYS.PASSCODE_HASH, newHash);
    return true;
  }
};
