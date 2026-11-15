import React from 'react';
import { Sparkles, MapPin, Compass, ArrowRight, ShieldCheck, Star, Users, Flame, ExternalLink } from 'lucide-react';
import MotionCulinaryLoop from './MotionCulinaryLoop';

export default function HeroMotion({ onExploreStalls, onOpenSeating, onOpenReservation }) {
  const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=Abdullah+Bhaban,+Kazir+Dewri,+Chattogram";

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 overflow-hidden bg-gradient-to-b from-culinary-dark via-[#0d1117] to-culinary-dark">
      {/* Motion Graphics Canvas */}
      <MotionCulinaryLoop />

      {/* Decorative Radial Lighting Blurs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[450px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[300px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Live Status Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-culinary-card/90 border border-amber-500/30 text-xs font-semibold text-slate-200 mb-6 shadow-lg shadow-amber-500/5 animate-fade-in">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-emerald-400 font-bold">Open Today 11 AM - 11:30 PM</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-300">Abdullah Bhaban, Kazir Dewri</span>
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-culinary-gold hover:underline font-bold"
          >
            <span>Map</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Main Display Headline */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-[1.12]">
          Dhaka’s Flagship{' '}
          <span className="gold-gradient-text italic font-normal">Gourmet Food Hall</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          Over <span className="text-white font-semibold">20 non-overlapping specialty stalls</span>, 
          from royal Awadhi handi curries and wood-fired sourdough pies to artisanal smash burgers and 
          handcrafted Italian gelato. <span className="text-amber-300 font-medium">600+ communal seats</span> at Gulshan Centre Point.
        </p>

        {/* CTA Buttons */}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onExploreStalls}
            className="px-7 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-culinary-dark shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 group"
          >
            <span>Explore 12+ Signature Stalls</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={onOpenSeating}
            className="px-6 py-3.5 rounded-xl font-semibold text-sm bg-culinary-card/80 hover:bg-culinary-card border border-slate-700/80 hover:border-amber-400/50 text-white backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <Compass className="w-4 h-4 text-culinary-gold" />
            <span>Interactive Floor & Seating Map</span>
          </button>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3.5 rounded-xl font-semibold text-xs sm:text-sm bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 transition-all flex items-center gap-1.5"
          >
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>Directions via Google Maps</span>
          </a>
        </div>

        {/* Proof & Metrics Badges */}
        <div className="mt-14 pt-8 border-t border-slate-800/80 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-3 rounded-xl bg-culinary-card/40 border border-slate-800/60">
            <div className="flex items-center justify-center gap-1.5 text-culinary-gold font-bold text-2xl font-serif">
              <span>20+</span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-medium">Distinct Specialty Stalls</p>
            <span className="text-[10px] text-emerald-400 font-semibold">Zero Menu Duplication</span>
          </div>

          <div className="p-3 rounded-xl bg-culinary-card/40 border border-slate-800/60">
            <div className="flex items-center justify-center gap-1.5 text-culinary-gold font-bold text-2xl font-serif">
              <span>600+</span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-medium">Dining Capacity</p>
            <span className="text-[10px] text-slate-400">4 Experiential Zones</span>
          </div>

          <div className="p-3 rounded-xl bg-culinary-card/40 border border-slate-800/60">
            <div className="flex items-center justify-center gap-1 text-culinary-gold font-bold text-2xl font-serif">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span>4.8</span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-medium">Google Rating</p>
            <span className="text-[10px] text-amber-300 font-semibold">4,800+ Verified Diners</span>
          </div>

          <div className="p-3 rounded-xl bg-culinary-card/40 border border-slate-800/60">
            <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-bold text-2xl font-serif">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <span>100%</span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-medium">Halal Certified</p>
            <span className="text-[10px] text-slate-400">Strict Quality Audits</span>
          </div>
        </div>
      </div>
    </section>
  );
}
