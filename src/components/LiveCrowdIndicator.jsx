import React, { useState, useEffect } from 'react';
import { Users, Clock, Flame, Zap, CheckCircle2, ChevronRight, Info } from 'lucide-react';
import { liveCrowdStats } from '../data/seatingZones';

export default function LiveCrowdIndicator({ onOpenReservation }) {
  const [occupancy, setOccupancy] = useState(liveCrowdStats.occupancyPercentage);
  const [seated, setSeated] = useState(liveCrowdStats.currentlySeated);

  // Micro-fluctuation simulation for realistic live tracking
  useEffect(() => {
    const interval = setInterval(() => {
      const delta = (Math.random() - 0.5) * 4;
      setOccupancy((prev) => Math.min(94, Math.max(48, Math.round(prev + delta))));
      setSeated((prev) => Math.min(580, Math.max(310, Math.round(prev + delta * 5))));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="crowd-status" className="py-12 bg-culinary-dark border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-culinary-card via-[#151a21] to-culinary-card border border-slate-700/60 shadow-2xl relative overflow-hidden">
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Header info */}
            <div className="lg:col-span-5 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Live Food Hall Telemetry</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                Real-Time Hall Occupancy & Seating
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Check current crowd density before arriving at Abdullah Bhaban, Kazir Dewri. With 600+ seats spanning four distinct ambiance zones, walk-ins find seating smoothly.
              </p>
              <div className="pt-2 flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Clock className="w-4 h-4 text-culinary-gold" />
                  Avg wait time: <strong className="text-white">~3 mins</strong>
                </span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Live Kitchens: <strong className="text-emerald-400">All 12 Active</strong>
                </span>
              </div>
            </div>

            {/* Live Progress Bar & Stats */}
            <div className="lg:col-span-7 bg-[#0b0e12]/80 p-5 md:p-6 rounded-2xl border border-slate-800">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-culinary-gold" />
                  <span className="text-sm font-semibold text-slate-200">
                    Current Capacity: <span className="text-white font-bold">{seated}</span> / {liveCrowdStats.totalCapacity} Diners
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400/15 text-amber-300 border border-amber-400/30">
                  {occupancy}% Occupied • Lively Atmosphere
                </span>
              </div>

              {/* Progress Bar with animated gradient */}
              <div className="w-full h-3.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-amber-500 transition-all duration-1000 ease-out shadow-sm"
                  style={{ width: `${occupancy}%` }}
                />
              </div>

              {/* Hourly Peak Forecast Pill Strip */}
              <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="text-slate-400 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-culinary-gold" />
                  <span>Next projected peak: <strong>8:15 PM (Dinner rush)</strong></span>
                </div>
                <button
                  onClick={onOpenReservation}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-culinary-gold hover:text-amber-300 transition-colors"
                >
                  <span>Reserve Table Ahead</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
