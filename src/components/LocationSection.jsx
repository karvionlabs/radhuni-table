import React from 'react';
import { MapPin, Navigation, Clock, Car, Phone, ExternalLink, ShieldCheck, Compass } from 'lucide-react';

export default function LocationSection() {
  const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=Abdullah+Bhaban,+Kazir+Dewri,+Chattogram";

  return (
    <section id="location" className="py-20 bg-culinary-dark border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-culinary-gold text-xs font-semibold uppercase tracking-wider mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>Prime Location & Arrival Guide</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Visit Radhuni Table at Kazir Dewri
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300">
            Located at Abdullah Bhaban, in the bustling heart of Kazir Dewri, Chattogram.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Info Column */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Address Card */}
              <div className="p-6 rounded-2xl bg-culinary-card border border-slate-800 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-culinary-gold" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Full Address</h3>
                    <p className="text-xs sm:text-sm text-slate-200 mt-1 leading-relaxed">
                      <strong className="text-white">Abdullah Bhaban</strong> (আব্দুল্লাহ ভবন),<br />
                      Kazir Dewri (কাজির দেউরি),<br />
                      Chattogram 4000, Bangladesh
                    </p>
                    <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center gap-3">
                      <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-culinary-gold hover:text-amber-300 transition-colors"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Open in Google Maps App</span>
                        <ExternalLink className="w-3 h-3 ml-0.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hours Card */}
              <div className="p-6 rounded-2xl bg-culinary-card border border-slate-800 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-white">Operating Hours</h3>
                    <div className="mt-2 space-y-1 text-xs">
                      <div className="flex justify-between text-slate-300">
                        <span>Monday – Thursday:</span>
                        <span className="font-semibold text-white">11:00 AM – 11:30 PM</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Friday – Saturday:</span>
                        <span className="font-semibold text-amber-300">11:00 AM – 11:30 PM (Peak)</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Sunday:</span>
                        <span className="font-semibold text-white">11:00 AM – 11:30 PM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Parking Guidance */}
              <div className="p-6 rounded-2xl bg-culinary-card border border-slate-800 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                    <Car className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Parking & Access</h3>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                      Convenient parking available at Abdullah Bhaban and adjacent Kazir Dewri commercial area. Easy accessibility from SS Khaled Road and Kazir Dewri Circle.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Directions Button */}
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 rounded-2xl text-center font-bold text-sm bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-culinary-dark shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Turn-by-Turn GPS Directions</span>
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </div>

          {/* Right Map Canvas & Visual Card */}
          <div className="lg:col-span-7 rounded-3xl bg-culinary-card border border-slate-800 overflow-hidden shadow-2xl relative min-h-[460px] flex flex-col">
            {/* Embedded Google Maps View centered on Kazir Dewri, Chattogram */}
            <div className="relative flex-1 w-full min-h-[360px] overflow-hidden">
              <iframe
                title="Radhuni Table Abdullah Bhaban Kazir Dewri Chattogram Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3689.915729177699!2d91.8242!3d22.3478!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30acd88b5b3b1237%3A0x6b3f7be52382c7f3!2sKazir%20Dewri%2C%20Chattogram%2C%20Bangladesh!5e0!3m2!1sen!2sbd!4v1700000000000"
                className="w-full h-full border-0 filter grayscale-[20%] contrast-[110%] opacity-90 hover:opacity-100 transition-opacity"
                loading="lazy"
                allowFullScreen
              />
              <div className="absolute top-4 left-4 bg-culinary-dark/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700 text-xs font-semibold text-slate-200 shadow-xl flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span>Radhuni Table • Abdullah Bhaban, Kazir Dewri</span>
              </div>
            </div>

            {/* Bottom Delivery Partners Bar */}
            <div className="p-5 bg-[#0b0e12] border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Prefer Delivery to Home / Office?
                </span>
                <p className="text-xs text-slate-300">
                  Select stalls deliver via official food delivery apps across Kazir Dewri, GEC, Jamal Khan, and central Chattogram.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="https://pathao.com/food/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-rose-600/15 border border-rose-500/30 text-rose-300 hover:bg-rose-600/30 transition-colors flex items-center gap-1.5"
                >
                  <span>Pathao Food</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://www.foodpanda.com.bd/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-pink-600/15 border border-pink-500/30 text-pink-300 hover:bg-pink-600/30 transition-colors flex items-center gap-1.5"
                >
                  <span>Foodpanda</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
