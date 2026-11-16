import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  KeyRound,
  LayoutDashboard,
  Users,
  ChefHat,
  CalendarCheck,
  MessageSquare,
  Clock,
  Sliders,
  LogOut,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Search,
  Download,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  Eye,
  EyeOff,
  Flame,
  RotateCcw,
  Sparkles,
  Phone,
  MapPin,
  UtensilsCrossed,
  Layers,
  TrendingUp,
  Store,
  DollarSign
} from 'lucide-react';
import { adminStorage } from '../../services/adminStorageService';

export default function AdminPortal({ onExitAdmin }) {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('rt_admin_auth_session') === 'true';
  });
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [authError, setAuthError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState(0);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'crowd' | 'stalls' | 'reservations' | 'reviews' | 'site-info' | 'security'

  // Working States loaded from reactive adminStorage
  const [crowdStats, setCrowdStats] = useState(() => adminStorage.getCrowdStats());
  const [stalls, setStalls] = useState(() => adminStorage.getStalls());
  const [reservations, setReservations] = useState(() => adminStorage.getReservations());
  const [reviews, setReviews] = useState(() => adminStorage.getReviews());
  const [siteConfig, setSiteConfig] = useState(() => adminStorage.getConfig());

  // Interactive UI helpers
  const [toastMessage, setToastMessage] = useState('');
  const [selectedStallId, setSelectedStallId] = useState(stalls[0]?.id || '');

  // Sub-features: Reservations search & filters
  const [resSearch, setResSearch] = useState('');
  const [resFilterStatus, setResFilterStatus] = useState('All');
  const [showNewResModal, setShowNewResModal] = useState(false);
  const [newResForm, setNewResForm] = useState({
    name: '',
    phone: '',
    zone: 'Garden Atrium',
    date: new Date().toLocaleDateString('en-GB'),
    time: '8:00 PM',
    notes: '',
  });

  // Sub-features: Add new dish
  const [showAddDish, setShowAddDish] = useState(false);
  const [newDish, setNewDish] = useState({
    name: '',
    price: 350,
    description: '',
    category: 'Chef Special',
    spiciness: 1,
    image: '',
  });

  // Sub-features: Passcode change
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');

  // Lockout countdown timer
  useEffect(() => {
    let interval = null;
    if (lockoutTimer > 0) {
      interval = setInterval(() => {
        setLockoutTimer((t) => (t > 1 ? t - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [lockoutTimer]);

  // Sync state if storage updates externally
  useEffect(() => {
    const handleStoreUpdate = () => {
      setCrowdStats(adminStorage.getCrowdStats());
      setStalls(adminStorage.getStalls());
      setReservations(adminStorage.getReservations());
      setReviews(adminStorage.getReviews());
      setSiteConfig(adminStorage.getConfig());
    };
    window.addEventListener('radhuni_store_updated', handleStoreUpdate);
    return () => window.removeEventListener('radhuni_store_updated', handleStoreUpdate);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Auth Handler
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (lockoutTimer > 0) return;

    const isValid = await adminStorage.verifyPasscode(passcode);
    if (isValid) {
      setIsAuthenticated(true);
      sessionStorage.setItem('rt_admin_auth_session', 'true');
      setAuthError('');
      setFailedAttempts(0);
      showToast('Master authentication verified. Welcome to Radhuni Table Operations.');
    } else {
      const nextFailures = failedAttempts + 1;
      setFailedAttempts(nextFailures);
      if (nextFailures >= 3) {
        setLockoutTimer(60);
        setAuthError('Too many failed attempts. Security lockout active for 60 seconds.');
      } else {
        setAuthError(`Invalid passcode. ${3 - nextFailures} attempt(s) remaining.`);
      }
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('rt_admin_auth_session');
    setIsAuthenticated(false);
    setPasscode('');
    if (onExitAdmin) onExitAdmin();
  };

  // 1. Crowd Telemetry Control
  const handleSaveCrowd = () => {
    adminStorage.saveCrowdStats(crowdStats);
    showToast('Live hall crowd metrics successfully published.');
  };

  // 2. Stalls & Menu Management
  const selectedStall = stalls.find((s) => s.id === selectedStallId) || stalls[0];

  const handleToggleStallStatus = (stallId) => {
    const updated = stalls.map((s) => {
      if (s.id === stallId) {
        const nextStatus = s.badge === 'Closed' ? 'Guest Favorite' : 'Closed';
        return { ...s, badge: nextStatus };
      }
      return s;
    });
    setStalls(updated);
    adminStorage.saveStalls(updated);
    showToast('Stall operating status updated.');
  };

  const handleUpdateDishField = (stallId, dishId, field, value) => {
    const updated = stalls.map((s) => {
      if (s.id === stallId) {
        const updatedMenu = s.menu.map((d) => {
          if (d.id === dishId) {
            return { ...d, [field]: value };
          }
          return d;
        });
        return { ...s, menu: updatedMenu };
      }
      return s;
    });
    setStalls(updated);
    adminStorage.saveStalls(updated);
  };

  const handleToggleDishStock = (stallId, dishId) => {
    const updated = stalls.map((s) => {
      if (s.id === stallId) {
        const updatedMenu = s.menu.map((d) => (d.id === dishId ? { ...d, soldOut: !d.soldOut } : d));
        return { ...s, menu: updatedMenu };
      }
      return s;
    });
    setStalls(updated);
    adminStorage.saveStalls(updated);
    showToast('Dish stock availability updated.');
  };

  const handleDeleteDish = (stallId, dishId) => {
    if (window.confirm('Delete this dish permanently from the stall menu?')) {
      const updated = stalls.map((s) => {
        if (s.id === stallId) {
          return { ...s, menu: s.menu.filter((d) => d.id !== dishId) };
        }
        return s;
      });
      setStalls(updated);
      adminStorage.saveStalls(updated);
      showToast('Dish removed from menu.');
    }
  };

  const handleAddNewDish = (e) => {
    e.preventDefault();
    if (!newDish.name.trim()) return;

    const dishRecord = {
      id: `${selectedStall.id}-d-${Date.now()}`,
      name: newDish.name.trim(),
      price: Math.max(10, parseInt(newDish.price) || 100),
      description: newDish.description.trim() || 'Prepared fresh by master chefs at Radhuni Table.',
      dietary: ['Halal', newDish.category],
      spiciness: Number(newDish.spiciness) || 0,
      image: newDish.image.trim() || selectedStall.image,
      popular: true,
      soldOut: false,
    };

    const updated = stalls.map((s) => {
      if (s.id === selectedStall.id) {
        return { ...s, menu: [dishRecord, ...s.menu] };
      }
      return s;
    });
    setStalls(updated);
    adminStorage.saveStalls(updated);
    setShowAddDish(false);
    setNewDish({ name: '', price: 350, description: '', category: 'Chef Special', spiciness: 1, image: '' });
    showToast(`"${dishRecord.name}" added to ${selectedStall.name} menu.`);
  };

  // 3. Reservations Roster Actions
  const filteredReservations = useMemo(() => {
    return (reservations || []).filter((r) => {
      const matchSearch =
        r.name?.toLowerCase().includes(resSearch.toLowerCase()) ||
        r.phone?.includes(resSearch) ||
        r.code?.toLowerCase().includes(resSearch.toLowerCase());
      const matchStatus = resFilterStatus === 'All' || r.status === resFilterStatus;
      return matchSearch && matchStatus;
    });
  }, [reservations, resSearch, resFilterStatus]);

  const handleUpdateResStatus = (resId, newStatus) => {
    const updated = reservations.map((r) => (r.id === resId ? { ...r, status: newStatus } : r));
    setReservations(updated);
    adminStorage.saveReservations(updated);
    showToast(`Reservation marked as ${newStatus}.`);
  };

  const handleDeleteReservation = (resId) => {
    if (window.confirm('Delete this reservation entry from the ledger?')) {
      const updated = reservations.filter((r) => r.id !== resId);
      setReservations(updated);
      adminStorage.saveReservations(updated);
      showToast('Reservation removed from ledger.');
    }
  };

  const handleManualAddReservation = (e) => {
    e.preventDefault();
    if (!newResForm.name.trim() || !newResForm.phone.trim()) return;

    const resCode = 'RES-CTG-' + Math.floor(1000 + Math.random() * 9000);
    const newEntry = {
      id: 'res-manual-' + Date.now(),
      code: resCode,
      name: newResForm.name.trim(),
      phone: newResForm.phone.trim(),
      zone: newResForm.zone,
      date: newResForm.date,
      time: newResForm.time,
      status: 'Confirmed',
      notes: newResForm.notes.trim() || 'Manual booking recorded via Executive Portal',
      createdAt: new Date().toISOString(),
    };

    adminStorage.addReservation(newEntry);
    setShowNewResModal(false);
    setNewResForm({ name: '', phone: '', zone: 'Garden Atrium', date: new Date().toLocaleDateString('en-GB'), time: '8:00 PM', notes: '' });
    showToast(`Booking ${resCode} confirmed for ${newEntry.name}.`);
  };

  const handleExportCSV = () => {
    const headers = ['Booking Code', 'Guest Name', 'Phone', 'Zone', 'Date', 'Time', 'Status', 'Notes'];
    const rows = filteredReservations.map((r) => [
      `"${r.code || ''}"`,
      `"${r.name || ''}"`,
      `"${r.phone || ''}"`,
      `"${r.zone || ''}"`,
      `"${r.date || ''}"`,
      `"${r.time || ''}"`,
      `"${r.status || 'Confirmed'}"`,
      `"${(r.notes || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RadhuniTable_Reservations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Reservation ledger exported to CSV successfully.');
  };

  // 4. Review Moderation
  const handleDeleteReview = (revId) => {
    if (window.confirm('Remove this review from the public diner feed?')) {
      const updated = reviews.filter((r) => r.id !== revId);
      setReviews(updated);
      adminStorage.saveReviews(updated);
      showToast('Review removed from live feed.');
    }
  };

  // 5. Site Info & Hours
  const handleSaveSiteConfig = (e) => {
    e.preventDefault();
    adminStorage.saveConfig(siteConfig);
    showToast('Website operating hours and contact information updated live.');
  };

  // 6. Security & Master Passcode
  const handleChangePasscode = async (e) => {
    e.preventDefault();
    if (newPasscode.length < 6) {
      alert('Passcode must be at least 6 characters.');
      return;
    }
    if (newPasscode !== confirmPasscode) {
      alert('Passcodes do not match.');
      return;
    }
    await adminStorage.changePasscode(newPasscode);
    setNewPasscode('');
    setConfirmPasscode('');
    showToast('Master admin passcode updated successfully.');
  };

  const handleFactoryReset = () => {
    if (window.confirm('CRITICAL ACTION: Reset all custom changes back to original source code defaults?')) {
      adminStorage.resetToFactoryDefaults();
      setCrowdStats(adminStorage.getCrowdStats());
      setStalls(adminStorage.getStalls());
      setReservations(adminStorage.getReservations());
      setReviews(adminStorage.getReviews());
      setSiteConfig(adminStorage.getConfig());
      showToast('All system modifications reset to factory defaults.');
    }
  };

  // Unauthenticated Login Gate
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[100] min-h-screen bg-[#07090C] text-slate-100 flex flex-col justify-between p-6 overflow-y-auto selection:bg-amber-500 selection:text-black">
        {/* Top bar with back to site */}
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 via-culinary-gold to-yellow-300 p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-culinary-dark rounded-[6px] flex items-center justify-center">
                <UtensilsCrossed className="w-4 h-4 text-culinary-gold" />
              </div>
            </div>
            <span className="font-serif text-lg font-bold tracking-tight text-white">
              RADHUNI TABLE
            </span>
          </div>

          <button
            onClick={onExitAdmin}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-slate-800 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Return to Diner Website</span>
          </button>
        </div>

        {/* Center Auth Card */}
        <div className="max-w-md w-full mx-auto my-12 p-8 rounded-3xl bg-[#0E1217] border border-amber-500/30 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-culinary-gold mx-auto">
            <KeyRound className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
              Stealth Operations Console
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
              Executive Authentication
            </h1>
            <p className="text-xs text-slate-400 mt-1.5">
              Enter your master administrative key to take full control of stalls, menus, live occupancy, and diner reservations.
            </p>
          </div>

          {authError && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={showPasscode ? 'text' : 'password'}
                required
                disabled={lockoutTimer > 0}
                placeholder="Enter Master Passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-culinary-gold transition-colors font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPasscode(!showPasscode)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={lockoutTimer > 0}
              className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                lockoutTimer > 0
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-culinary-dark shadow-lg shadow-amber-500/20'
              }`}
            >
              {lockoutTimer > 0 ? `Locked Out (${lockoutTimer}s)` : 'Unlock Operations Suite'}
            </button>

            <div className="pt-2 text-[11px] text-slate-400">
              <span>Default Initial Key: </span>
              <strong className="text-amber-300 font-mono">radhuni786</strong>
            </div>
          </form>
        </div>

        {/* Footer info */}
        <div className="text-center text-[11px] text-slate-400">
          <span>Radhuni Table Chattogram • Abdullah Bhaban Executive Suite • 100% Confidential</span>
        </div>
      </div>
    );
  }

  // Authenticated Dedicated Admin Application View
  return (
    <div className="fixed inset-0 z-[100] min-h-screen bg-[#07090C] text-slate-100 flex flex-col overflow-hidden font-sans selection:bg-amber-500 selection:text-black">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[110] px-5 py-2.5 rounded-xl bg-emerald-500 text-culinary-dark font-bold text-xs shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Application Header Bar */}
      <header className="h-16 px-6 bg-[#0E1217] border-b border-slate-800 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 via-culinary-gold to-yellow-300 p-0.5 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <div className="w-full h-full bg-culinary-dark rounded-[10px] flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4 text-culinary-gold" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-base sm:text-lg font-bold text-white tracking-tight">
                Radhuni Table Operations Suite
              </h1>
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30">
                Stealth CMS
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Live Control Engine • Abdullah Bhaban, Kazir Dewri Flagship
            </p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live Sync Active</span>
          </div>

          <button
            onClick={onExitAdmin}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-slate-700/80 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <ExternalLink className="w-3.5 h-3.5 text-culinary-gold" />
            <span>View Live Website</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
            title="Lock & Exit Console"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Workspace Body: Sidebar + Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <aside className="w-64 bg-[#0A0D11] border-r border-slate-800 p-4 flex flex-col justify-between flex-shrink-0 overflow-y-auto">
          <div className="space-y-1">
            <span className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-2">
              Operations Navigation
            </span>

            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-amber-500 text-culinary-dark shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('crowd')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'crowd'
                  ? 'bg-amber-500 text-culinary-dark shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Hall & Crowd Telemetry</span>
            </button>

            <button
              onClick={() => setActiveTab('stalls')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'stalls'
                  ? 'bg-amber-500 text-culinary-dark shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <ChefHat className="w-4 h-4" />
              <span>Stalls & Menu Dishes</span>
              <span className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-amber-300">
                {stalls.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('reservations')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'reservations'
                  ? 'bg-amber-500 text-culinary-dark shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Reservations Ledger</span>
              <span className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                {reservations.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'reviews'
                  ? 'bg-amber-500 text-culinary-dark shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Diner Reviews</span>
            </button>

            <button
              onClick={() => setActiveTab('site-info')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'site-info'
                  ? 'bg-amber-500 text-culinary-dark shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Operating Hours & Info</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'security'
                  ? 'bg-amber-500 text-culinary-dark shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Security & Passcode</span>
            </button>
          </div>

          {/* Sidebar Bottom Status */}
          <div className="p-3.5 rounded-2xl bg-[#0E1217] border border-slate-800 space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 block">
              Authority Status
            </span>
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Master Owner Mode</span>
            </div>
            <p className="text-[10px] text-slate-400">
              Zero public exposure • 100% Client-Side Local
            </p>
          </div>
        </aside>

        {/* Main Content Workspace */}
        <main className="flex-1 bg-[#07090C] overflow-y-auto p-6 sm:p-8 space-y-8">
          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                  Executive Cockpit
                </span>
                <h2 className="font-serif text-3xl font-bold text-white tracking-tight mt-1">
                  Radhuni Table Operations Overview
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Real-time pulse of stalls, crowd density, pending reservations, and diner sentiment.
                </p>
              </div>

              {/* 4 Key Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="p-5 rounded-2xl bg-[#0E1217] border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                    <span>Active Food Stalls</span>
                    <Store className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-serif font-bold text-white">
                    {stalls.filter((s) => s.badge !== 'Closed').length} / {stalls.length}
                  </div>
                  <span className="text-[11px] text-emerald-400 font-semibold block">
                    All 12 Culinary Stalls Operational
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-[#0E1217] border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                    <span>Hall Occupancy</span>
                    <Users className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-serif font-bold text-white">
                    {crowdStats.occupancyPercentage}%
                  </div>
                  <span className="text-[11px] text-slate-400 font-semibold block">
                    {crowdStats.currentlySeated} of {crowdStats.totalCapacity || 600} Seats Filled
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-[#0E1217] border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                    <span>Table Bookings</span>
                    <CalendarCheck className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-serif font-bold text-white">
                    {reservations.length}
                  </div>
                  <span className="text-[11px] text-blue-300 font-semibold block">
                    {reservations.filter((r) => r.status === 'Confirmed').length} Confirmed Today
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-[#0E1217] border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                    <span>Customer Rating</span>
                    <MessageSquare className="w-4 h-4 text-culinary-gold" />
                  </div>
                  <div className="text-2xl font-serif font-bold text-white">
                    4.8 / 5.0
                  </div>
                  <span className="text-[11px] text-amber-300 font-semibold block">
                    {reviews.length} Verified Reviews Tracked
                  </span>
                </div>
              </div>

              {/* Quick Action Control Banners */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div
                  onClick={() => setActiveTab('crowd')}
                  className="p-6 rounded-2xl bg-gradient-to-br from-[#12161E] to-[#0A0D11] border border-amber-500/20 hover:border-amber-400/50 transition-all cursor-pointer group"
                >
                  <Users className="w-6 h-6 text-culinary-gold mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="text-base font-bold text-white">Adjust Hall Crowd</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Set wait times, seated guest count, or change hall atmosphere to Peak Rush mode.
                  </p>
                </div>

                <div
                  onClick={() => setActiveTab('stalls')}
                  className="p-6 rounded-2xl bg-gradient-to-br from-[#12161E] to-[#0A0D11] border border-amber-500/20 hover:border-amber-400/50 transition-all cursor-pointer group"
                >
                  <ChefHat className="w-6 h-6 text-culinary-gold mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="text-base font-bold text-white">Manage Dishes & Pricing</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Update BDT prices, toggle items as Sold Out, or add new culinary creations.
                  </p>
                </div>

                <div
                  onClick={() => setActiveTab('reservations')}
                  className="p-6 rounded-2xl bg-gradient-to-br from-[#12161E] to-[#0A0D11] border border-amber-500/20 hover:border-amber-400/50 transition-all cursor-pointer group"
                >
                  <CalendarCheck className="w-6 h-6 text-culinary-gold mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="text-base font-bold text-white">Table Reservations</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Review incoming customer bookings, seat guests, and export to CSV spreadsheets.
                  </p>
                </div>
              </div>

              {/* Recent Bookings Snapshot */}
              <div className="p-6 rounded-2xl bg-[#0E1217] border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white font-serif">
                    Recent Table Inquiries
                  </h3>
                  <button
                    onClick={() => setActiveTab('reservations')}
                    className="text-xs font-semibold text-culinary-gold hover:underline"
                  >
                    View All ({reservations.length})
                  </button>
                </div>

                <div className="divide-y divide-slate-800/80">
                  {reservations.slice(0, 3).map((r) => (
                    <div key={r.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-white">{r.name}</span>
                        <span className="text-slate-400 ml-2 font-mono">({r.phone})</span>
                        <span className="text-[10px] text-amber-400 block font-mono">{r.code} • {r.zone}</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        {r.status || 'Confirmed'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CROWD & OCCUPANCY */}
          {activeTab === 'crowd' && (
            <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                  Live Operations Telemetry
                </span>
                <h2 className="font-serif text-3xl font-bold text-white tracking-tight mt-1">
                  Hall Occupancy & Crowd Controls
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Adjust live telemetry figures that diners see on the homepage crowd indicator widget.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-[#0E1217] border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Occupancy Percentage
                    </label>
                    <span className="text-lg font-bold text-amber-400 font-mono">
                      {crowdStats.occupancyPercentage}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={crowdStats.occupancyPercentage}
                    onChange={(e) =>
                      setCrowdStats({ ...crowdStats, occupancyPercentage: Number(e.target.value) })
                    }
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>0% Empty</span>
                    <span>50% Balanced</span>
                    <span>100% Full Capacity</span>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#0E1217] border border-slate-800 space-y-3">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Currently Seated Guests (out of 600+)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="700"
                    value={crowdStats.currentlySeated}
                    onChange={(e) =>
                      setCrowdStats({ ...crowdStats, currentlySeated: Number(e.target.value) })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-culinary-gold"
                  />
                  <p className="text-[11px] text-slate-400">
                    Changes reflect dynamically across the 4 dining ambiance zones.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#0E1217] border border-slate-800 space-y-3">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Estimated Wait Time
                  </label>
                  <input
                    type="text"
                    value={crowdStats.averageWaitTime}
                    onChange={(e) =>
                      setCrowdStats({ ...crowdStats, averageWaitTime: e.target.value })
                    }
                    placeholder="e.g. ~3 mins, 5-10 mins, or Direct Seating"
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-slate-700 text-white text-sm focus:outline-none focus:border-culinary-gold"
                  />
                </div>

                <div className="p-6 rounded-2xl bg-[#0E1217] border border-slate-800 space-y-3">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Preset Atmosphere Status
                  </label>
                  <select
                    value={
                      crowdStats.occupancyPercentage > 75
                        ? 'Peak Rush'
                        : crowdStats.occupancyPercentage > 45
                        ? 'Lively'
                        : 'Relaxed'
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'Peak Rush') setCrowdStats({ ...crowdStats, occupancyPercentage: 85, averageWaitTime: '8-12 mins' });
                      else if (val === 'Lively') setCrowdStats({ ...crowdStats, occupancyPercentage: 64, averageWaitTime: '~3 mins' });
                      else setCrowdStats({ ...crowdStats, occupancyPercentage: 35, averageWaitTime: 'Direct Walk-in' });
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-slate-700 text-white text-sm focus:outline-none focus:border-culinary-gold cursor-pointer"
                  >
                    <option value="Lively">Lively & Welcoming (Normal Food Hall Flow)</option>
                    <option value="Peak Rush">Peak Rush Hour (Friday / Weekend Evening)</option>
                    <option value="Relaxed">Relaxed & Calm (Afternoon / Quiet)</option>
                  </select>
                </div>
              </div>

              {/* Customer Live Preview Box */}
              <div className="p-5 rounded-2xl bg-[#0E1217] border border-amber-500/30 space-y-3">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 block">
                  Live Public Preview (How Diners See It)
                </span>
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-black/50 border border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-300 block">
                      Capacity: <strong className="text-white">{crowdStats.currentlySeated}</strong> / 600 Diners
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      Avg Wait: <strong className="text-culinary-gold">{crowdStats.averageWaitTime}</strong>
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400/15 text-amber-300 border border-amber-400/30">
                    {crowdStats.occupancyPercentage}% Occupied
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSaveCrowd}
                  className="px-6 py-3 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-culinary-dark shadow-lg shadow-amber-500/20 text-xs uppercase tracking-wider cursor-pointer flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Publish Telemetry Updates</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: STALLS & MENU DISHES */}
          {activeTab === 'stalls' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                    Culinary Inventory
                  </span>
                  <h2 className="font-serif text-3xl font-bold text-white tracking-tight mt-1">
                    Stalls & Menu Management
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Update BDT prices, toggle Sold-Out status, or add new signature dishes.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={selectedStallId}
                    onChange={(e) => setSelectedStallId(e.target.value)}
                    className="px-4 py-2.5 rounded-xl bg-[#0E1217] border border-amber-500/40 text-amber-300 font-semibold text-xs focus:outline-none cursor-pointer"
                  >
                    {stalls.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.stallNumber}: {s.name} ({s.category})
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => setShowAddDish(true)}
                    className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-culinary-dark font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Dish</span>
                  </button>
                </div>
              </div>

              {/* Selected Stall Header Card */}
              {selectedStall && (
                <div className="p-6 rounded-2xl bg-[#0E1217] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={selectedStall.image}
                      alt={selectedStall.name}
                      className="w-16 h-16 rounded-xl object-cover border border-amber-500/30 flex-shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-400">{selectedStall.stallNumber}</span>
                        <h3 className="text-xl font-serif font-bold text-white">{selectedStall.name}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          selectedStall.badge === 'Closed' ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                        }`}>
                          {selectedStall.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 max-w-xl">{selectedStall.description}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleStallStatus(selectedStall.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 flex-shrink-0 ${
                      selectedStall.badge === 'Closed'
                        ? 'bg-emerald-500 text-culinary-dark hover:bg-emerald-400 shadow-md shadow-emerald-500/20'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                    }`}
                  >
                    {selectedStall.badge === 'Closed' ? 'Reopen Stall' : 'Temporarily Close Stall'}
                  </button>
                </div>
              )}

              {/* Add New Dish Modal Drawer */}
              {showAddDish && (
                <div className="p-6 rounded-2xl bg-[#12161E] border border-amber-500/40 space-y-4 animate-in slide-in-from-top-3 duration-200">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white font-serif flex items-center gap-2">
                      <Plus className="w-4 h-4 text-amber-400" />
                      <span>Add Dish to {selectedStall.name}</span>
                    </h4>
                    <button
                      onClick={() => setShowAddDish(false)}
                      className="p-1 rounded text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleAddNewDish} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">Dish Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Saffron Dum Handi"
                        value={newDish.name}
                        onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-slate-700 text-white focus:outline-none focus:border-culinary-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">Price (BDT ৳)</label>
                      <input
                        type="number"
                        required
                        min="10"
                        value={newDish.price}
                        onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-slate-700 text-white focus:outline-none focus:border-culinary-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">Dietary Badge</label>
                      <select
                        value={newDish.category}
                        onChange={(e) => setNewDish({ ...newDish, category: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-slate-700 text-white focus:outline-none cursor-pointer"
                      >
                        <option value="Chef Special">Chef Special</option>
                        <option value="Halal">100% Halal</option>
                        <option value="Vegetarian">Vegetarian</option>
                        <option value="Spicy Catch">Spicy Catch</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-slate-300 mb-1 font-semibold">Culinary Description</label>
                      <input
                        type="text"
                        placeholder="Describe spices, preparation method, and accompaniments..."
                        value={newDish.description}
                        onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-slate-700 text-white focus:outline-none focus:border-culinary-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">Image URL (Optional)</label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={newDish.image}
                        onChange={(e) => setNewDish({ ...newDish, image: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-slate-700 text-white focus:outline-none focus:border-culinary-gold"
                      />
                    </div>

                    <div className="sm:col-span-3 flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddDish(false)}
                        className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-culinary-dark"
                      >
                        Save & Add Dish
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Dishes Table */}
              <div className="border border-slate-800 rounded-2xl overflow-hidden bg-[#0A0D11]">
                <div className="p-4 bg-[#0E1217] border-b border-slate-800 flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <span>Exclusive Menu Dishes ({selectedStall?.menu.length} items)</span>
                  <span>Price (BDT) & Availability Controls</span>
                </div>

                <div className="divide-y divide-slate-800">
                  {selectedStall?.menu.map((dish) => (
                    <div
                      key={dish.id}
                      className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                    >
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        {dish.image && (
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-amber-500/30 shadow-md">
                            <img
                              src={dish.image}
                              alt={dish.name}
                              className="w-full h-full object-cover"
                            />
                            {dish.soldOut && (
                              <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-[9px] font-bold text-rose-300 uppercase">
                                Sold Out
                              </div>
                            )}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={dish.name}
                              onChange={(e) =>
                                handleUpdateDishField(selectedStall.id, dish.id, 'name', e.target.value)
                              }
                              className="font-bold text-sm text-white bg-transparent border-b border-transparent hover:border-slate-700 focus:border-culinary-gold focus:outline-none"
                            />
                            {dish.soldOut && (
                              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                                Sold Out
                              </span>
                            )}
                          </div>
                          <input
                            type="text"
                            value={dish.description}
                            onChange={(e) =>
                              handleUpdateDishField(selectedStall.id, dish.id, 'description', e.target.value)
                            }
                            className="text-xs text-slate-400 bg-transparent border-b border-transparent hover:border-slate-700 focus:border-culinary-gold focus:outline-none w-full truncate mt-0.5"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        {/* Price Input */}
                        <div className="flex items-center gap-1 bg-black/60 px-3 py-1.5 rounded-xl border border-slate-700">
                          <span className="text-culinary-gold font-bold text-xs">৳</span>
                          <input
                            type="number"
                            value={dish.price}
                            onChange={(e) =>
                              handleUpdateDishField(selectedStall.id, dish.id, 'price', Number(e.target.value))
                            }
                            className="w-16 bg-transparent text-white font-mono text-xs focus:outline-none"
                          />
                        </div>

                        {/* Sold Out Toggle */}
                        <button
                          onClick={() => handleToggleDishStock(selectedStall.id, dish.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                            dish.soldOut
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                          }`}
                        >
                          {dish.soldOut ? 'Mark In Stock' : 'Mark Sold Out'}
                        </button>

                        {/* Delete Dish */}
                        <button
                          onClick={() => handleDeleteDish(selectedStall.id, dish.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Delete Dish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: RESERVATIONS ROSTER */}
          {activeTab === 'reservations' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                    Dining Bookings
                  </span>
                  <h2 className="font-serif text-3xl font-bold text-white tracking-tight mt-1">
                    Table Reservations Ledger
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Real-time guest inquiries placed via website booking or recorded manually.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowNewResModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Plus className="w-4 h-4 text-culinary-gold" />
                    <span>New Booking</span>
                  </button>

                  <button
                    onClick={handleExportCSV}
                    className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-culinary-dark font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export CSV Spreadsheet</span>
                  </button>
                </div>
              </div>

              {/* Manual Booking Drawer */}
              {showNewResModal && (
                <div className="p-6 rounded-2xl bg-[#12161E] border border-amber-500/40 space-y-4 animate-in slide-in-from-top-3 duration-200">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white font-serif">
                      Record Manual Table Reservation
                    </h4>
                    <button
                      onClick={() => setShowNewResModal(false)}
                      className="p-1 rounded text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleManualAddReservation} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">Guest Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Shakil Ahmed"
                        value={newResForm.name}
                        onChange={(e) => setNewResForm({ ...newResForm, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-slate-700 text-white focus:outline-none focus:border-culinary-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">Mobile Phone (BD)</label>
                      <input
                        type="tel"
                        required
                        placeholder="017XXXXXXXX"
                        value={newResForm.phone}
                        onChange={(e) => setNewResForm({ ...newResForm, phone: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-slate-700 text-white focus:outline-none focus:border-culinary-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">Ambiance Zone</label>
                      <select
                        value={newResForm.zone}
                        onChange={(e) => setNewResForm({ ...newResForm, zone: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-slate-700 text-white focus:outline-none cursor-pointer"
                      >
                        <option value="Garden Atrium">Garden Atrium</option>
                        <option value="Central Skylight & Live Kitchens">Central Skylight & Live Kitchens</option>
                        <option value="Family & Executive Booths">Family & Executive Booths</option>
                        <option value="Emerald Cafe & Espresso Lounge">Emerald Cafe & Espresso Lounge</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">Date</label>
                      <input
                        type="text"
                        value={newResForm.date}
                        onChange={(e) => setNewResForm({ ...newResForm, date: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-slate-700 text-white focus:outline-none focus:border-culinary-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">Time</label>
                      <input
                        type="text"
                        value={newResForm.time}
                        onChange={(e) => setNewResForm({ ...newResForm, time: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-slate-700 text-white focus:outline-none focus:border-culinary-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">Notes / Seating Request</label>
                      <input
                        type="text"
                        placeholder="Corner table, anniversary..."
                        value={newResForm.notes}
                        onChange={(e) => setNewResForm({ ...newResForm, notes: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-slate-700 text-white focus:outline-none focus:border-culinary-gold"
                      />
                    </div>

                    <div className="sm:col-span-3 flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowNewResModal(false)}
                        className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-culinary-dark"
                      >
                        Confirm Booking
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Filters & Search Bar */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by guest name, phone, or booking code..."
                    value={resSearch}
                    onChange={(e) => setResSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0E1217] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-culinary-gold"
                  />
                </div>

                <select
                  value={resFilterStatus}
                  onChange={(e) => setResFilterStatus(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-[#0E1217] border border-slate-800 text-xs text-slate-300 focus:outline-none cursor-pointer"
                >
                  <option value="All">All Statuses ({reservations.length})</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Seated">Seated</option>
                  <option value="Pending">Pending</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Reservations Table */}
              <div className="border border-slate-800 rounded-2xl overflow-hidden bg-[#0A0D11]">
                <div className="p-3.5 bg-[#0E1217] border-b border-slate-800 grid grid-cols-12 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <span className="col-span-3">Guest & Code</span>
                  <span className="col-span-3">Phone & Zone</span>
                  <span className="col-span-3">Date & Time</span>
                  <span className="col-span-3 text-right">Status & Action</span>
                </div>

                {filteredReservations.length === 0 ? (
                  <div className="p-12 text-center text-xs text-slate-400">
                    No reservations match your filter criteria.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-800/80">
                    {filteredReservations.map((res) => (
                      <div
                        key={res.id}
                        className="p-4 grid grid-cols-12 items-center text-xs hover:bg-white/[0.02] transition-colors"
                      >
                        <div className="col-span-3">
                          <span className="font-bold text-white block text-sm">{res.name}</span>
                          <span className="text-[10px] font-mono text-culinary-gold">{res.code}</span>
                        </div>

                        <div className="col-span-3 text-slate-300">
                          <span className="font-mono block">{res.phone}</span>
                          <span className="text-[10px] text-slate-400">{res.zone}</span>
                        </div>

                        <div className="col-span-3 text-slate-300">
                          <span className="block">{res.date}</span>
                          <span className="text-[10px] text-slate-400">{res.time}</span>
                        </div>

                        <div className="col-span-3 flex items-center justify-end gap-2">
                          <select
                            value={res.status || 'Confirmed'}
                            onChange={(e) => handleUpdateResStatus(res.id, e.target.value)}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer border ${
                              res.status === 'Seated'
                                ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                                : res.status === 'Cancelled'
                                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            }`}
                          >
                            <option value="Confirmed">Confirmed</option>
                            <option value="Seated">Seated</option>
                            <option value="Pending">Pending</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>

                          <button
                            onClick={() => handleDeleteReservation(res.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: DINER REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                  Customer Sentiment
                </span>
                <h2 className="font-serif text-3xl font-bold text-white tracking-tight mt-1">
                  Verified Diner Reviews Moderation
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Manage diner reviews shown in the public verified testimonials section.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 rounded-2xl bg-[#0E1217] border border-slate-800 flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-white text-sm">{rev.author}</h4>
                          <span className="text-[10px] text-slate-400">{rev.role}</span>
                        </div>
                        <span className="text-amber-400 text-xs font-bold font-mono">
                          ★ {rev.rating} / 5
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        "{rev.comment}"
                      </p>
                      <span className="text-[10px] text-slate-500 block">
                        {rev.date} • {rev.source}
                      </span>
                    </div>

                    <div className="flex justify-end pt-2 border-t border-slate-800/80">
                      <button
                        onClick={() => handleDeleteReview(rev.id)}
                        className="px-3 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs hover:bg-rose-500/25 cursor-pointer flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Review</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: OPERATING HOURS & SITE INFO */}
          {activeTab === 'site-info' && (
            <div className="space-y-6 max-w-2xl animate-in fade-in duration-200">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                  Live Brand Details
                </span>
                <h2 className="font-serif text-3xl font-bold text-white tracking-tight mt-1">
                  Operating Hours & Site Information
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Control the schedule, address, and live status pills rendered on the website.
                </p>
              </div>

              <form onSubmit={handleSaveSiteConfig} className="p-6 rounded-2xl bg-[#0E1217] border border-slate-800 space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Operating Schedule (Weekday Line)
                  </label>
                  <input
                    type="text"
                    value={siteConfig.operatingHoursLine1}
                    onChange={(e) => setSiteConfig({ ...siteConfig, operatingHoursLine1: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-white focus:outline-none focus:border-culinary-gold"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Operating Schedule (Weekend / 7-Day Line)
                  </label>
                  <input
                    type="text"
                    value={siteConfig.operatingHoursLine2}
                    onChange={(e) => setSiteConfig({ ...siteConfig, operatingHoursLine2: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-white focus:outline-none focus:border-culinary-gold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Status Badge (Top Right of Hours)
                    </label>
                    <input
                      type="text"
                      value={siteConfig.operatingBadge}
                      onChange={(e) => setSiteConfig({ ...siteConfig, operatingBadge: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-white focus:outline-none focus:border-culinary-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Hero Status Pill
                    </label>
                    <input
                      type="text"
                      value={siteConfig.heroStatusPill}
                      onChange={(e) => setSiteConfig({ ...siteConfig, heroStatusPill: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-white focus:outline-none focus:border-culinary-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Restaurant Address
                  </label>
                  <input
                    type="text"
                    value={siteConfig.addressText}
                    onChange={(e) => setSiteConfig({ ...siteConfig, addressText: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-white focus:outline-none focus:border-culinary-gold"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Official Contact Phone Number
                  </label>
                  <input
                    type="text"
                    value={siteConfig.restaurantPhone}
                    onChange={(e) => setSiteConfig({ ...siteConfig, restaurantPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-white focus:outline-none focus:border-culinary-gold"
                  />
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-culinary-dark shadow-md cursor-pointer"
                  >
                    Save & Update Website Info
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 7: SECURITY & SYSTEM */}
          {activeTab === 'security' && (
            <div className="space-y-6 max-w-xl animate-in fade-in duration-200">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                  System Administration
                </span>
                <h2 className="font-serif text-3xl font-bold text-white tracking-tight mt-1">
                  Master Security & Settings
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Manage administrative passcodes or restore factory defaults.
                </p>
              </div>

              {/* Change Passcode */}
              <div className="p-6 rounded-2xl bg-[#0E1217] border border-slate-800 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2 font-serif">
                  <KeyRound className="w-4 h-4 text-culinary-gold" />
                  <span>Update Master Passcode</span>
                </h4>

                <form onSubmit={handleChangePasscode} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">New Passcode (min 6 chars)</label>
                    <input
                      type="password"
                      required
                      value={newPasscode}
                      onChange={(e) => setNewPasscode(e.target.value)}
                      placeholder="Enter new strong passcode"
                      className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-slate-700 text-white focus:outline-none focus:border-culinary-gold font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Confirm New Passcode</label>
                    <input
                      type="password"
                      required
                      value={confirmPasscode}
                      onChange={(e) => setConfirmPasscode(e.target.value)}
                      placeholder="Re-enter new passcode"
                      className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-slate-700 text-white focus:outline-none focus:border-culinary-gold font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-culinary-dark cursor-pointer shadow-md"
                  >
                    Update Passcode
                  </button>
                </form>
              </div>

              {/* Factory Reset */}
              <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>Restore Factory Defaults</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Reset all stalls, menu prices, live telemetry, and review overrides back to the original source code defaults.
                </p>
                <button
                  onClick={handleFactoryReset}
                  className="px-4 py-2 rounded-xl font-bold bg-rose-600 hover:bg-rose-500 text-white text-xs cursor-pointer flex items-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Data to Original State</span>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
