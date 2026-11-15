import React, { useState } from 'react';
import { X, Calendar, Clock, Users, CheckCircle2, Phone, Mail, Sparkles, MapPin } from 'lucide-react';
import { seatingZones } from '../data/seatingZones';

export default function ReservationModal({ isOpen, onClose, initialZone }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: new Date().toISOString().split('T')[0],
    time: '19:30',
    guests: '4',
    zone: initialZone || 'Garden Atrium',
    notes: '',
  });

  const [confirmedReservation, setConfirmedReservation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const resCode = 'RES-G2-' + Math.floor(1000 + Math.random() * 9000);
      setConfirmedReservation({
        ...formData,
        code: resCode,
      });
    }, 900);
  };

  const handleDownloadICS = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Radhuni Table Kazir Dewri//Reservation//EN
BEGIN:VEVENT
SUMMARY:Dining at Radhuni Table (${confirmedReservation.zone})
DESCRIPTION:Reservation code: ${confirmedReservation.code}\\nGuests: ${confirmedReservation.guests}\\nRadhuni Table - Abdullah Bhaban, Kazir Dewri, Chattogram
LOCATION:Radhuni Table, Abdullah Bhaban, Kazir Dewri, Chattogram
DTSTART:${confirmedReservation.date.replace(/-/g, '')}T${confirmedReservation.time.replace(':', '')}00
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `RadhuniTable_Reservation_${confirmedReservation.code}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl bg-culinary-card border border-slate-700 shadow-2xl p-6 sm:p-8 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmedReservation ? (
          /* Confirmation Success Card */
          <div className="text-center space-y-4 py-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Table Reserved Successfully
              </span>
              <h3 className="text-2xl font-serif font-bold text-white mt-1">
                We're Expecting You!
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Your reservation at Radhuni Table Gulshan 2 is locked in.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0b0e12] border border-slate-800 text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Confirmation Code</span>
                <span className="font-mono font-bold text-culinary-gold">{confirmedReservation.code}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Guest Name</span>
                <span className="font-medium">{confirmedReservation.name}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Zone</span>
                <span className="font-medium text-amber-400">{confirmedReservation.zone}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Date & Time</span>
                <span className="font-medium">{confirmedReservation.date} at {confirmedReservation.time}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Party Size</span>
                <span className="font-medium">{confirmedReservation.guests} Guests</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleDownloadICS}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4 text-culinary-gold" />
                <span>Add to Calendar (.ics)</span>
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-culinary-dark font-bold text-xs transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Form View */
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-culinary-gold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Complimentary Table Booking</span>
              </div>
              <h3 className="text-2xl font-serif font-bold text-white">
                Reserve Seats or Booths
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                No reservation fee required. Guarantee seating for groups, families, and team outings.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Asaduzzaman Nur"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b0e12] border border-slate-800 text-white focus:outline-none focus:border-culinary-gold"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phone Number (BD)</label>
                  <input
                    type="tel"
                    required
                    placeholder="017XXXXXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b0e12] border border-slate-800 text-white focus:outline-none focus:border-culinary-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Dining Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0b0e12] border border-slate-800 text-white focus:outline-none focus:border-culinary-gold"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Preferred Time</label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0b0e12] border border-slate-800 text-white focus:outline-none focus:border-culinary-gold"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Guests</label>
                  <select
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0b0e12] border border-slate-800 text-white focus:outline-none focus:border-culinary-gold"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Preferred Zone</label>
                <select
                  value={formData.zone}
                  onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b0e12] border border-slate-800 text-white focus:outline-none focus:border-culinary-gold"
                >
                  {seatingZones.map((z) => (
                    <option key={z.id} value={z.name}>
                      {z.name} ({z.capacity} seats • {z.status})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Special Notes / Occasion (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Birthday dinner, need baby high-chair, quiet corner"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0b0e12] border border-slate-800 text-white focus:outline-none focus:border-culinary-gold"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-culinary-dark shadow-xl shadow-amber-500/20 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Confirming Table...</span>
                  ) : (
                    <span>Confirm Table Reservation</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
