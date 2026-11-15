import React, { useState } from 'react';
import { Compass, Users, Check, Sparkles, Volume2, CalendarCheck, ArrowRight, Eye } from 'lucide-react';
import { seatingZones } from '../data/seatingZones';

export default function SeatingMap({ onSelectZoneForReservation }) {
  const [activeZoneId, setActiveZoneId] = useState('garden-atrium');
  const activeZone = seatingZones.find((z) => z.id === activeZoneId) || seatingZones[0];

  return (
    <section id="seating" className="py-20 bg-culinary-dark border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Interactive Floor Architecture</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            600+ Seats Across 4 Dining Zones
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
            Whether you crave the theatrical energy of sizzling woks, a quiet family leather booth, 
            or a sunlit garden table, explore each curated sector of Radhuni Table, Kazir Dewri.
          </p>
        </div>

        {/* Zone Selector Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {seatingZones.map((zone) => {
            const isSelected = activeZoneId === zone.id;
            return (
              <button
                key={zone.id}
                onClick={() => setActiveZoneId(zone.id)}
                className={`p-4 rounded-2xl border text-left transition-all spring-click ${
                  isSelected
                    ? 'bg-culinary-card border-culinary-gold shadow-lg shadow-amber-500/10'
                    : 'bg-[#0f1216] border-slate-800 hover:border-slate-700 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${
                    isSelected ? 'text-culinary-gold' : 'text-slate-400'
                  }`}>
                    {zone.capacity} Seats
                  </span>
                  <span className={`w-2 h-2 rounded-full ${
                    zone.statusColor === 'emerald' ? 'bg-emerald-400' : 'bg-amber-400'
                  }`} />
                </div>
                <h3 className={`text-sm sm:text-base font-bold ${
                  isSelected ? 'text-white' : 'text-slate-300'
                }`}>
                  {zone.name}
                </h3>
              </button>
            );
          })}
        </div>

        {/* Zone Showcase Layout */}
        <div className="rounded-3xl bg-culinary-card border border-slate-800 overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12">
          {/* Visual Canvas / Image */}
          <div className="lg:col-span-7 relative min-h-[340px] sm:min-h-[440px] overflow-hidden">
            <img
              src={activeZone.image}
              alt={activeZone.name}
              className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-culinary-card via-culinary-card/30 to-transparent" />

            {/* Overlaid Badges */}
            <div className="absolute top-6 left-6 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-culinary-dark/90 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
                {activeZone.status}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/60 backdrop-blur-md text-slate-300">
                {activeZone.currentOccupancy}% Occupancy
              </span>
            </div>

            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-xs text-slate-300 bg-culinary-dark/80 backdrop-blur-md p-3 rounded-xl border border-slate-700/60">
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-culinary-gold" />
                <span>Ambiance: <em>{activeZone.ambientSound}</em></span>
              </span>
            </div>
          </div>

          {/* Zone Detail Info */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-culinary-gold uppercase tracking-wider block">
                  Experiential Zone Breakdown
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                  {activeZone.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  {activeZone.subtitle}
                </p>
              </div>

              {/* Ideal For */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-slate-800 text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">
                  Recommended For
                </span>
                <p className="text-slate-200 font-medium">{activeZone.idealFor}</p>
              </div>

              {/* Architectural Features */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Zone Amenities & Features
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {activeZone.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-200"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span className="truncate">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={() => onSelectZoneForReservation(activeZone.name)}
                className="w-full py-3.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-culinary-dark shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 spring-click"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Reserve Seats in {activeZone.name}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
