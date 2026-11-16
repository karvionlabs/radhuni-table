import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Lock,
  KeyRound,
  ShieldCheck,
  ChefHat,
  Users,
  CalendarCheck,
  MessageSquare,
  Sliders,
  RotateCcw,
  Download,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
  EyeOff,
  Flame,
  Check,
  FileSpreadsheet,
  ToggleLeft,
  ToggleRight,
  TrendingUp
} from 'lucide-react';
import { adminStorage } from '../../services/adminStorageService';

export default function HiddenAdminModal({ isOpen, onClose }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [authError, setAuthError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState(0);

  // Active Management Tab
  const [activeTab, setActiveTab] = useState('crowd'); // 'crowd' | 'stalls' | 'reservations' | 'reviews' | 'settings'

  // Working States
  const [crowdStats, setCrowdStats] = useState(adminStorage.getCrowdStats());
  const [stalls, setStalls] = useState(adminStorage.getStalls());
  const [reservations, setReservations] = useState(adminStorage.getReservations());
  const [reviews, setReviews] = useState(adminStorage.getReviews());

  // Search & Filter in Tabs
  const [resSearch, setResSearch] = useState('');
  const [resFilterStatus, setResFilterStatus] = useState('All');
  const [selectedStallId, setSelectedStallId] = useState(stalls[0]?.id || '');
  const [toastMessage, setToastMessage] = useState('');

  // Settings: New Passcode State
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');

  // Memoized filter for reservations (declared before any early returns or helpers)
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
    };
    window.addEventListener('radhuni_store_updated', handleStoreUpdate);
    return () => window.removeEventListener('radhuni_store_updated', handleStoreUpdate);
  }, []);

  // Keyboard accessibility: Escape to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleModalClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleModalClose = () => {
    setPasscode('');
    setAuthError('');
    onClose();
  };

  // Auth Handler
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (lockoutTimer > 0) return;

    const isValid = await adminStorage.verifyPasscode(passcode);
    if (isValid) {
      setIsAuthenticated(true);
      setAuthError('');
      setFailedAttempts(0);
      showToast('Authentication confirmed. Welcome to Radhuni Table Operations.');
    } else {
      const nextFailures = failedAttempts + 1;
      setFailedAttempts(nextFailures);
      if (nextFailures >= 3) {
        setLockoutTimer(60);
        setAuthError('Too many failed attempts. Security lockout active for 60 seconds.');
      } else {
        setAuthError(`Invalid passcode. ${3 - nextFailures} attempts remaining.`);
      }
    }
  };

  // 1. Crowd Status Update
  const handleSaveCrowd = () => {
    adminStorage.saveCrowdStats(crowdStats);
    showToast('Live hall crowd metrics successfully updated on homepage.');
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

  const handleUpdateDishPrice = (stallId, dishId, newPrice) => {
    const priceNum = Math.max(0, parseInt(newPrice) || 0);
    const updated = stalls.map((s) => {
      if (s.id === stallId) {
        const updatedMenu = s.menu.map((d) => (d.id === dishId ? { ...d, price: priceNum } : d));
        return { ...s, menu: updatedMenu };
      }
      return s;
    });
    setStalls(updated);
    adminStorage.saveStalls(updated);
    showToast('Dish price updated in live menu.');
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

  // 3. Reservations Roster Actions
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

  // Export CSV of Reservations
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

  // 5. Settings: Passcode Change & Factory Reset
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
    if (window.confirm('WARNING: Are you sure you want to reset all modifications back to factory production defaults? This cannot be undone.')) {
      adminStorage.resetToFactoryDefaults();
      setCrowdStats(adminStorage.getCrowdStats());
      setStalls(adminStorage.getStalls());
      setReviews(adminStorage.getReviews());
      showToast('All data successfully restored to factory defaults.');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] overflow-y-auto bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-5xl rounded-3xl bg-[#0c0f13] border border-amber-500/40 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-200">
        {/* Global Toast Notification */}
        {toastMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-emerald-500 text-culinary-dark font-bold text-xs shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-3 duration-200">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-[#12161c] border-b border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-culinary-gold">
              <ShieldCheck className="w-5 h-5 text-culinary-gold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg font-bold text-white tracking-tight">
                  Radhuni Table Operations Console
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  Stealth CMS
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Kazir Dewri Flagship • Abdullah Bhaban Executive Management
              </p>
            </div>
          </div>

          <button
            onClick={handleModalClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close admin console"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conditional View: Login Gate vs Full Control Console */}
        {!isAuthenticated ? (
          /* Authentication Screen */
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-culinary-gold">
              <KeyRound className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-serif text-2xl font-bold text-white">
                Executive Authentication
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter your Master Passcode to access live operational controls and restaurant records.
              </p>
            </div>

            {authError && (
              <div className="w-full p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="w-full space-y-4">
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
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
                {lockoutTimer > 0 ? `Locked Out (${lockoutTimer}s)` : 'Unlock Operations Console'}
              </button>

              <div className="pt-2 text-[11px] text-slate-400">
                <span>Default Initial Passcode: </span>
                <strong className="text-amber-300 font-mono">radhuni786</strong>
              </div>
            </form>
          </div>
        ) : (
          /* Authenticated Management Console */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-60 bg-[#0f1318] border-r border-slate-800 p-3 space-y-1 flex-shrink-0 flex md:flex-col overflow-x-auto md:overflow-visible">
              <button
                onClick={() => setActiveTab('crowd')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold w-full transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'crowd'
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Hall Capacity & Crowd</span>
              </button>

              <button
                onClick={() => setActiveTab('stalls')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold w-full transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'stalls'
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <ChefHat className="w-4 h-4" />
                <span>Stalls & Menu Pricing</span>
              </button>

              <button
                onClick={() => setActiveTab('reservations')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold w-full transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'reservations'
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Bookings Ledger</span>
                {reservations.length > 0 && (
                  <span className="ml-auto px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300">
                    {reservations.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold w-full transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'reviews'
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Verified Reviews</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold w-full transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>System & Security</span>
              </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              {/* TAB 1: HALL CAPACITY & CROWD */}
              {activeTab === 'crowd' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-white">
                      Real-Time Hall Occupancy Controls
                    </h3>
                    <p className="text-xs text-slate-400">
                      Configure live guest counts and wait estimates shown on the main page telemetry section.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="p-5 rounded-2xl bg-[#11151a] border border-slate-800 space-y-3">
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Occupancy Percentage ({crowdStats.occupancyPercentage}%)
                      </label>
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

                    <div className="p-5 rounded-2xl bg-[#11151a] border border-slate-800 space-y-2">
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
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-culinary-gold"
                      />
                    </div>

                    <div className="p-5 rounded-2xl bg-[#11151a] border border-slate-800 space-y-2">
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Average Wait Time Text
                      </label>
                      <input
                        type="text"
                        value={crowdStats.averageWaitTime}
                        onChange={(e) =>
                          setCrowdStats({ ...crowdStats, averageWaitTime: e.target.value })
                        }
                        placeholder="e.g. ~3 mins or Walk-in Direct"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-slate-700 text-white text-sm focus:outline-none focus:border-culinary-gold"
                      />
                    </div>

                    <div className="p-5 rounded-2xl bg-[#11151a] border border-slate-800 space-y-2">
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Hall Atmosphere Status
                      </label>
                      <select
                        value={crowdStats.occupancyPercentage > 75 ? 'Peak Rush' : 'Lively'}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === 'Peak Rush') setCrowdStats({ ...crowdStats, occupancyPercentage: 85 });
                          else if (val === 'Lively') setCrowdStats({ ...crowdStats, occupancyPercentage: 60 });
                          else setCrowdStats({ ...crowdStats, occupancyPercentage: 35 });
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-slate-700 text-white text-sm focus:outline-none focus:border-culinary-gold cursor-pointer"
                      >
                        <option value="Lively">Lively & Welcoming (Normal Dining)</option>
                        <option value="Peak Rush">Peak Rush Hour (Friday / Weekend Evening)</option>
                        <option value="Relaxed">Relaxed & Calm (Afternoon / Quiet)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleSaveCrowd}
                      className="px-6 py-2.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-culinary-dark shadow-md shadow-amber-500/20 text-xs cursor-pointer flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Publish Live Crowd Updates</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: STALLS & MENU PRICING */}
              {activeTab === 'stalls' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-white">
                        Specialty Stalls & Menu Management
                      </h3>
                      <p className="text-xs text-slate-400">
                        Adjust dish pricing, mark sold-out items, or toggle stall operational badges.
                      </p>
                    </div>

                    {/* Stall Selector Dropdown */}
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-slate-400">Selected Stall:</label>
                      <select
                        value={selectedStallId}
                        onChange={(e) => setSelectedStallId(e.target.value)}
                        className="px-3 py-2 rounded-xl bg-[#12161c] border border-amber-500/40 text-amber-300 font-semibold text-xs focus:outline-none cursor-pointer"
                      >
                        {stalls.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.stallNumber}: {s.name} ({s.category})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Selected Stall Header Card */}
                  {selectedStall && (
                    <div className="p-5 rounded-2xl bg-[#12161c] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-amber-400">{selectedStall.stallNumber}</span>
                          <h4 className="text-lg font-serif font-bold text-white">{selectedStall.name}</h4>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            selectedStall.badge === 'Closed' ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                          }`}>
                            {selectedStall.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{selectedStall.tagline}</p>
                      </div>

                      <button
                        onClick={() => handleToggleStallStatus(selectedStall.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 ${
                          selectedStall.badge === 'Closed'
                            ? 'bg-emerald-500 text-culinary-dark hover:bg-emerald-400'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                        }`}
                      >
                        {selectedStall.badge === 'Closed' ? 'Reopen Stall' : 'Temporarily Close Stall'}
                      </button>
                    </div>
                  )}

                  {/* Dishes Table */}
                  <div className="border border-slate-800 rounded-2xl overflow-hidden bg-[#0d1014]">
                    <div className="p-3 bg-[#11151a] border-b border-slate-800 flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <span>Exclusive Dishes ({selectedStall?.menu.length} items)</span>
                      <span>Price (BDT) & Availability</span>
                    </div>

                    <div className="divide-y divide-slate-800">
                      {selectedStall?.menu.map((dish) => (
                        <div
                          key={dish.id}
                          className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {dish.image && (
                              <img
                                src={dish.image}
                                alt={dish.name}
                                className="w-12 h-12 rounded-xl object-cover border border-amber-500/30 flex-shrink-0"
                              />
                            )}
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="text-sm font-bold text-white truncate">{dish.name}</h5>
                                {dish.soldOut && (
                                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                                    Sold Out
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-400 line-clamp-1">{dish.description}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 flex-shrink-0">
                            <div className="flex items-center gap-1.5 bg-black/60 px-3 py-1.5 rounded-xl border border-slate-700">
                              <span className="text-culinary-gold font-bold text-xs">৳</span>
                              <input
                                type="number"
                                value={dish.price}
                                onChange={(e) =>
                                  handleUpdateDishPrice(selectedStall.id, dish.id, e.target.value)
                                }
                                className="w-16 bg-transparent text-white font-mono text-xs focus:outline-none"
                              />
                            </div>

                            <button
                              onClick={() => handleToggleDishStock(selectedStall.id, dish.id)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                                dish.soldOut
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              }`}
                            >
                              {dish.soldOut ? 'Mark In Stock' : 'Mark Sold Out'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: RESERVATIONS ROSTER */}
              {activeTab === 'reservations' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-white">
                        Table Reservations Ledger
                      </h3>
                      <p className="text-xs text-slate-400">
                        Live diner bookings placed directly through the complimentary booking modal.
                      </p>
                    </div>

                    <button
                      onClick={handleExportCSV}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-culinary-dark font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export CSV Spreadsheet</span>
                    </button>
                  </div>

                  {/* Filters & Search Bar */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search by guest name, phone, or booking code..."
                        value={resSearch}
                        onChange={(e) => setResSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#11151a] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-culinary-gold"
                      />
                    </div>

                    <select
                      value={resFilterStatus}
                      onChange={(e) => setResFilterStatus(e.target.value)}
                      className="px-3.5 py-2.5 rounded-xl bg-[#11151a] border border-slate-800 text-xs text-slate-300 focus:outline-none cursor-pointer"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Seated">Seated</option>
                      <option value="Pending">Pending</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Reservations Table */}
                  <div className="border border-slate-800 rounded-2xl overflow-hidden bg-[#0d1014]">
                    <div className="p-3 bg-[#11151a] border-b border-slate-800 grid grid-cols-12 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <span className="col-span-3">Guest & Code</span>
                      <span className="col-span-3">Phone & Zone</span>
                      <span className="col-span-3">Date & Time</span>
                      <span className="col-span-3 text-right">Status & Action</span>
                    </div>

                    {filteredReservations.length === 0 ? (
                      <div className="p-8 text-center text-xs text-slate-400">
                        No reservations match your filter criteria.
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-800/80">
                        {filteredReservations.map((res) => (
                          <div
                            key={res.id}
                            className="p-3.5 grid grid-cols-12 items-center text-xs hover:bg-white/[0.02] transition-colors"
                          >
                            <div className="col-span-3">
                              <span className="font-bold text-white block">{res.name}</span>
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
                                className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer border ${
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
                                className="p-1 rounded text-slate-500 hover:text-rose-400"
                                title="Delete"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: VERIFIED REVIEWS */}
              {activeTab === 'reviews' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-white">
                      Verified Diner Reviews Moderation
                    </h3>
                    <p className="text-xs text-slate-400">
                      Manage customer reviews appearing in the public testimonials section.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {reviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-4 rounded-2xl bg-[#11151a] border border-slate-800 flex items-start justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{rev.author}</span>
                            <span className="text-[10px] text-slate-400">({rev.role})</span>
                            <span className="text-amber-400 text-xs font-bold">★ {rev.rating}</span>
                          </div>
                          <p className="text-xs text-slate-300">{rev.comment}</p>
                          <span className="text-[10px] text-slate-500">{rev.date} • {rev.source}</span>
                        </div>

                        <button
                          onClick={() => handleDeleteReview(rev.id)}
                          className="px-3 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs hover:bg-rose-500/25 flex-shrink-0 cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: SYSTEM & SECURITY */}
              {activeTab === 'settings' && (
                <div className="space-y-6 animate-in fade-in duration-200 max-w-xl">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-white">
                      System Security & Configuration
                    </h3>
                    <p className="text-xs text-slate-400">
                      Change administrative master passcode or restore factory defaults.
                    </p>
                  </div>

                  {/* Change Passcode Card */}
                  <div className="p-6 rounded-2xl bg-[#11151a] border border-slate-800 space-y-4">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-culinary-gold" />
                      <span>Update Master Passcode</span>
                    </h4>

                    <form onSubmit={handleChangePasscode} className="space-y-3">
                      <div>
                        <label className="block text-xs text-slate-300 mb-1">New Passcode (min 6 chars)</label>
                        <input
                          type="password"
                          required
                          value={newPasscode}
                          onChange={(e) => setNewPasscode(e.target.value)}
                          placeholder="Enter new strong passcode"
                          className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-slate-700 text-white text-xs focus:outline-none focus:border-culinary-gold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1">Confirm New Passcode</label>
                        <input
                          type="password"
                          required
                          value={confirmPasscode}
                          onChange={(e) => setConfirmPasscode(e.target.value)}
                          placeholder="Re-enter new passcode"
                          className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-slate-700 text-white text-xs focus:outline-none focus:border-culinary-gold"
                        />
                      </div>

                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-culinary-dark text-xs cursor-pointer"
                      >
                        Update Passcode
                      </button>
                    </form>
                  </div>

                  {/* Factory Reset Card */}
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
                      <span>Reset to Original State</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
