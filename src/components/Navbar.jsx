import React, { useState, useEffect } from 'react';
import { UtensilsCrossed, ShoppingBag, MapPin, Clock, Menu, X, CalendarCheck, Sparkles } from 'lucide-react';

export default function Navbar({ trayItemsCount, trayTotal, onOpenTray, onOpenReservation }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Stalls & Menus', href: '#stalls' },
    { name: 'Dining Map (600+ Seats)', href: '#seating' },
    { name: 'Live Crowd', href: '#crowd-status' },
    { name: 'Location & Parking', href: '#location' },
    { name: 'Reviews', href: '#reviews' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-culinary-dark/95 backdrop-blur-md border-b border-culinary-border shadow-xl py-3'
          : 'bg-gradient-to-b from-culinary-dark/90 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Identity */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-600 via-culinary-gold to-yellow-300 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-culinary-dark rounded-[10px] flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5 text-culinary-gold animate-pulse-subtle" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-culinary-gold transition-colors">
                  RADHUNI TABLE
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full bg-amber-500/15 text-culinary-gold border border-amber-500/30">
                  Kazir Dewri
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium tracking-wide flex items-center gap-1">
                <span>Abdullah Bhaban, Chattogram</span>
                <span className="text-emerald-400 font-semibold">• Live Today</span>
              </p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-slate-300 hover:text-culinary-gold transition-colors relative group py-1"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-culinary-gold transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Actions: Reservation & Unified Tray */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenReservation}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all hover:border-culinary-gold/40 spring-click"
            >
              <CalendarCheck className="w-4 h-4 text-culinary-gold" />
              <span>Reserve Table</span>
            </button>

            {/* Tray Cart Button */}
            <button
              onClick={onOpenTray}
              className="relative flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-culinary-dark shadow-md shadow-amber-500/25 transition-all hover:scale-105 active:scale-95"
              aria-label="View unified dining tray"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {trayItemsCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-culinary-dark text-culinary-gold text-[10px] font-extrabold flex items-center justify-center border-2 border-amber-500 animate-bounce">
                    {trayItemsCount}
                  </span>
                )}
              </div>
              <span className="hidden md:inline">Unified Tray</span>
              {trayTotal > 0 && (
                <span className="px-1.5 py-0.5 rounded bg-culinary-dark/20 text-culinary-dark font-extrabold text-[11px]">
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
          <div className="lg:hidden mt-4 py-4 px-3 rounded-2xl bg-culinary-card/95 border border-slate-700/80 backdrop-blur-xl shadow-2xl flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-white/5 hover:text-culinary-gold transition-colors"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-2 border-t border-slate-700/60 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenReservation();
                }}
                className="w-full py-2.5 rounded-xl text-xs font-semibold bg-white/10 text-white flex items-center justify-center gap-2"
              >
                <CalendarCheck className="w-4 h-4 text-culinary-gold" />
                <span>Reserve Seating or Booth</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
