import React from 'react';
import { UtensilsCrossed, MapPin, Phone, Mail, ExternalLink, Heart } from 'lucide-react';

export default function Footer({ onOpenReservation, onOpenTray }) {
  const googleMapsUrl = "https://maps.app.goo.gl/hRYZ4iKM5BJ1Xf3x5";

  return (
    <footer className="bg-[#07090b] text-slate-400 border-t border-slate-800/80 pt-16 pb-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-culinary-gold to-yellow-300 p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-culinary-dark rounded-[10px] flex items-center justify-center">
                  <UtensilsCrossed className="w-5 h-5 text-culinary-gold" />
                </div>
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                CHEF’S TABLE
              </span>
            </div>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-sm">
              Dhaka's pioneer upscale multi-cuisine food court at Unimart Gulshan 2. 
              Featuring over 20 non-overlapping specialty culinary stalls and 600+ open communal seats.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-slate-800 flex items-center gap-1.5 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-culinary-gold" />
                <span>Google Maps Profile</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Explore
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#stalls" className="hover:text-culinary-gold transition-colors">
                  12+ Specialty Stalls
                </a>
              </li>
              <li>
                <a href="#seating" className="hover:text-culinary-gold transition-colors">
                  Dining Map (600+ Seats)
                </a>
              </li>
              <li>
                <a href="#crowd-status" className="hover:text-culinary-gold transition-colors">
                  Real-time Occupancy
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-culinary-gold transition-colors">
                  Google Maps Reviews
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenReservation}
                  className="hover:text-culinary-gold transition-colors text-left"
                >
                  Reserve a Table or Booth
                </button>
              </li>
            </ul>
          </div>

          {/* Stalls Showcase */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Key Stalls
            </h4>
            <ul className="space-y-2">
              <li className="hover:text-white transition-colors">Darbar (Mughlai & Awadhi)</li>
              <li className="hover:text-white transition-colors">Turkish Fiesta (Charcoal Grills)</li>
              <li className="hover:text-white transition-colors">Madchef X (Smashed Burgers)</li>
              <li className="hover:text-white transition-colors">Pizza Guy (Stone Sourdough)</li>
              <li className="hover:text-white transition-colors">Hakka Dhaka (Indo-Chinese Wok)</li>
              <li className="hover:text-white transition-colors">Club Gelato (Italian Artisanal)</li>
            </ul>
          </div>

          {/* Visit & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Hours & Location
            </h4>
            <p className="text-slate-300">
              Level 2, Unimart, Gulshan Centre Point, Road 90, Gulshan 2, Dhaka 1212
            </p>
            <div className="space-y-1 text-slate-300">
              <p><strong className="text-white">Daily:</strong> 11:00 AM – 11:30 PM</p>
              <p><strong className="text-white">Seating:</strong> Walk-in & Reserved</p>
              <p><strong className="text-white">Parking:</strong> Unimart Basement 1 & 2</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} Chef’s Table Gulshan 2. Inspired by Dhaka’s premiere food hall culture.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with passion for culinary excellence</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
