import React, { useState, useEffect } from 'react';
import { UtensilsCrossed, ShoppingBag, MapPin, Menu, X, CalendarCheck, Compass, Users, Star } from 'lucide-react';

export default function Navbar({ trayItemsCount, trayTotal, onOpenTray, onOpenReservation }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Stalls & Menu', href: '#stalls', icon: UtensilsCrossed },
    { name: 'Dining Map', href: '#seating', icon: Compass },
    { name: 'Live Crowd', href: '#crowd-status', icon: Users },
    { name: 'Location', href: '#location', icon: MapPin },
    { name: 'Reviews', href: '#reviews', icon: Star },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-culinary-dark/95 backdrop-blur-md border-b border-culinary-border shadow-2xl py-2.5'
          : 'bg-gradient-to-b from-culinary-dark/95 via-culinary-dark/80 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Identity */}
          <a href="#" className="flex items-center gap-3 group flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-culinary-gold to-yellow-300 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-culinary-dark rounded-[10px] flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5 text-culinary-gold animate-pulse-subtle" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg sm:text-xl font-extrabold tracking-tight text-white group-hover:text-culinary-gold transition-colors whitespace-nowrap">
                  RADHUNI TABLE
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider rounded-full bg-amber-500/15 text-culinary-gold border border-amber-500/30 whitespace-nowrap">
                  Kazir Dewri
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide flex items-center gap-1.5 whitespace-nowrap">
                <span>Abdullah Bhaban, Ctg</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                  Live Today
                </span>
              </p>
            </div>
          </a>

          {/* Desktop Navigation - Professional Segmented Pill Bar */}
          <nav className="hidden lg:flex items-center p-1 bg-slate-900/80 border border-slate-700/60 rounded-full backdrop-blur-xl shadow-lg shadow-black/40">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200 whitespace-nowrap group"
                >
                  <Icon className="w-3.5 h-3.5 text-culinary-gold/70 group-hover:text-culinary-gold transition-colors" />
                  <span>{link.name}</span>
                </a>
              );
            })}
          </nav>

          {/* Actions: Reservation & Unified Tray */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            {/* Reserve Table Pill Button */}
            <button
              onClick={onOpenReservation}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-culinary-gold border border-amber-500/30 hover:border-amber-500/60 transition-all hover:scale-105 active:scale-95 whitespace-nowrap shadow-sm"
            >
              <CalendarCheck className="w-4 h-4 text-culinary-gold" />
              <span>Reserve Table</span>
            </button>

            {/* Tray Cart Button */}
            <button
              onClick={onOpenTray}
              className="relative flex items-center gap-2 px-4 py-2 rounded-full text-xs font-extrabold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-culinary-dark shadow-md shadow-amber-500/25 transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
              aria-label="View unified dining tray"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {trayItemsCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 w-4 h-4 rounded-full bg-culinary-dark text-culinary-gold text-[9px] font-extrabold flex items-center justify-center border border-amber-500 animate-bounce">
                    {trayItemsCount}
                  </span>
                )}
              </div>
              <span className="hidden md:inline">Unified Tray</span>
              {trayTotal > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-culinary-dark/20 text-culinary-dark font-extrabold text-[10px]">
                  ৳{trayTotal.toLocaleString()}
                </span>
              )}
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-culinary-card border border-slate-700 text-slate-300 hover:text-white"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 py-3 px-3 rounded-2xl bg-culinary-card/95 border border-slate-700/80 backdrop-blur-xl shadow-2xl flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-white/5 hover:text-culinary-gold transition-colors"
                >
                  <Icon className="w-4 h-4 text-culinary-gold" />
                  <span>{link.name}</span>
                </a>
              );
            })}
            <div className="pt-2 border-t border-slate-700/60 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenReservation();
                }}
                className="w-full py-2.5 rounded-full text-xs font-bold bg-amber-500 text-culinary-dark flex items-center justify-center gap-2"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Reserve Table</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
