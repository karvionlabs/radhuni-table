import React, { useState, useEffect } from 'react';
import { Sparkles, MapPin, Compass, ArrowRight, ShieldCheck, Star, Users, Flame, ExternalLink } from 'lucide-react';
import MotionCulinaryLoop from './MotionCulinaryLoop';
import { adminStorage } from '../services/adminStorageService';

export default function HeroMotion({ onExploreStalls, onOpenSeating, onOpenReservation }) {
  const [siteConfig, setSiteConfig] = useState(() => adminStorage.getConfig());

  useEffect(() => {
    const handleUpdate = () => {
      setSiteConfig(adminStorage.getConfig());
    };
    window.addEventListener('radhuni_store_updated', handleUpdate);
    return () => window.removeEventListener('radhuni_store_updated', handleUpdate);
  }, []);

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
          <span className="text-emerald-400 font-bold">{siteConfig.heroStatusPill || 'Open 11 AM - 11:30 PM'}</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-300">{siteConfig.addressText || 'Abdullah Bhaban, Kazir Dewri'}</span>
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
          Chattogram’s Flagship{' '}
          <span className="gold-gradient-text italic font-normal">Gourmet Food Hall</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          Over <span className="text-white font-semibold">20 non-overlapping specialty stalls</span>, 
          from royal Awadhi handi curries and wood-fired sourdough pies to artisanal smash burgers and 
          handcrafted Italian gelato. <span className="text-amber-300 font-medium">600+ communal seats</span> at Abdullah Bhaban, Kazir Dewri.
        </p>

        {/* CTA Buttons */}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onExploreStalls}
            className="px-7 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-black/40 hover:shadow-amber-500/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center gap-2 group cursor-pointer"
          >
            <span>Explore 12+ Signature Stalls</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={onOpenSeating}
            className="px-6 py-3.5 rounded-xl font-semibold text-sm bg-culinary-card/90 hover:bg-culinary-card border border-white/10 hover:border-amber-400/50 text-white backdrop-blur-md shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center gap-2 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-culinary-gold" />
            <span>Interactive Floor & Seating Map</span>
          </button>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3.5 rounded-xl font-semibold text-xs sm:text-sm bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white hover:-translate-y-0.5 transition-all flex items-center gap-1.5"
          >
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>Directions via Google Maps</span>
          </a>
        </div>

        {/* Proof & Metrics Badges */}
        <div className="mt-14 pt-8 border-t border-white/[0.08] max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
          <div className="p-4 rounded-2xl bg-[#12161A]/70 border border-white/[0.06] backdrop-blur-sm hover:border-amber-500/25 transition-all">
            <div className="flex items-center justify-center gap-1.5 text-culinary-gold font-bold text-2xl font-serif">
              <span>20+</span>
            </div>
            <p className="text-xs text-slate-300 mt-1 font-medium">Distinct Specialty Stalls</p>
            <span className="text-[10px] text-emerald-400 font-semibold">Zero Menu Duplication</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#12161A]/70 border border-white/[0.06] backdrop-blur-sm hover:border-amber-500/25 transition-all">
            <div className="flex items-center justify-center gap-1.5 text-culinary-gold font-bold text-2xl font-serif">
              <span>600+</span>
            </div>
            <p className="text-xs text-slate-300 mt-1 font-medium">Dining Capacity</p>
            <span className="text-[10px] text-slate-400">4 Experiential Zones</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#12161A]/70 border border-white/[0.06] backdrop-blur-sm hover:border-amber-500/25 transition-all">
            <div className="flex items-center justify-center gap-1 text-culinary-gold font-bold text-2xl font-serif">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span>4.8</span>
            </div>
            <p className="text-xs text-slate-300 mt-1 font-medium">Google Rating</p>
            <span className="text-[10px] text-amber-300 font-semibold">4,800+ Verified Diners</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#12161A]/70 border border-white/[0.06] backdrop-blur-sm hover:border-amber-500/25 transition-all">
            <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-bold text-2xl font-serif">
              <ShieldCheck className="w-6 h-6" />
              <span>100%</span>
            </div>
            <p className="text-xs text-slate-300 mt-1 font-medium">Halal Certified</p>
            <span className="text-[10px] text-emerald-400 font-semibold">Strict Quality Audits</span>
          </div>
        </div>
      </div>
    </section>
  );
}
