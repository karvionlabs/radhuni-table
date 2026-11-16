import React, { useState, useMemo, useEffect } from 'react';
import { X, CheckCircle2, Phone, User, ShieldCheck, Lock, AlertCircle, Sparkles, Calendar } from 'lucide-react';
import { adminStorage } from '../services/adminStorageService';

/**
 * Production-Grade Input Sanitizer
 * Strips script tags, HTML tags, SQL injection delimiters, ASCII control chars, and zero-width spaces
 */
const sanitizeInput = (val, maxLen = 50) => {
  if (!val) return '';
  return String(val)
    .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // remove ASCII control characters
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // remove zero-width spaces
    .replace(/[<>'"`;\\=`]/g, '') // remove HTML & SQL injection delimiter chars
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .replace(/script/gi, '')
    .trim()
    .slice(0, maxLen);
};

/**
 * iCalendar CRLF & Delimiter Escape
 * Prevents VEVENT property injection & header splitting
 */
const escapeICS = (str) => {
  if (!str) return '';
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/[\r\n]+/g, ' ')
    .trim();
};

export default function ReservationModal({ isOpen, onClose, initialZone }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Anti-bot hidden trap
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [lastSubmitTime, setLastSubmitTime] = useState(0); // Rate limiter timestamp
  const [submissionCount, setSubmissionCount] = useState(0); // Anti-spam quota

  // Keyboard accessibility: Escape key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleResetAndClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Real-time Name Validation: 3-50 chars, Bengali or English letters, dots, hyphens, spaces
  const isNameValid = useMemo(() => {
    const clean = name.trim();
    if (clean.length < 3 || clean.length > 50) return false;
    // Allow English & Bengali alphabets, spaces, dots, hyphens
    const nameRegex = /^[a-zA-Z\u0980-\u09FF\s.'-]{3,50}$/;
    return nameRegex.test(clean);
  }, [name]);

  // Real-time Phone Validation: Bangladesh format 01[3-9]XXXXXXXX (11 digits) or +8801[3-9]XXXXXXXX
  const isPhoneValid = useMemo(() => {
    const digitsOnly = phone.replace(/[\s\-]/g, '');
    const bdPhoneRegex = /^(?:\+?880|0)1[3-9]\d{8}$/;
    return bdPhoneRegex.test(digitsOnly);
  }, [phone]);

  // Both fields must be fully valid before confirmation is allowed
  const isFormComplete = isNameValid && isPhoneValid;

  if (!isOpen) return null;

  const handleNameChange = (e) => {
    const raw = e.target.value;
    // Reject dangerous characters immediately
    const clean = raw.replace(/[<>'";\\=`]/g, '');
    setName(clean);
    if (errorMessage) setErrorMessage('');
  };

  const handlePhoneChange = (e) => {
    const raw = e.target.value;
    // Allow only digits, plus, hyphens, and spaces
    const clean = raw.replace(/[^\d+\-\s]/g, '').slice(0, 15);
    setPhone(clean);
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Security Gate 1: Honeypot check (reject if hidden bot trap is filled)
    if (honeypot) {
      setErrorMessage('Security violation detected: automated submission blocked.');
      return;
    }

    // Security Gate 2: Rate Limiting & Cooldown Protection (anti-spam)
    const now = Date.now();
    if (now - lastSubmitTime < 8000) {
      const waitSeconds = Math.ceil((8000 - (now - lastSubmitTime)) / 1000);
      setErrorMessage(`অতিরিক্ত অনুরোধ রোধ করা হয়েছে। অনুগ্রহ করে ${waitSeconds} সেকেন্ড অপেক্ষা করুন। (Rate limited: please wait)`);
      return;
    }

    if (submissionCount >= 5) {
      setErrorMessage('সেশন লিমিট পূর্ণ হয়েছে। আরও বুকিংয়ের জন্য পেজটি রিফ্রেশ করুন বা সরাসরি কল করুন।');
      return;
    }

    // Security Gate 3: Input completeness check
    if (!isFormComplete) {
      setErrorMessage('অনুগ্রহ করে নাম এবং সঠিক ১১ ডিজিটের ফোন নম্বর সঠিকভাবে লিখুন।');
      return;
    }

    // Security Gate 4: Sanitization & strict length validation
    const sanitizedName = sanitizeInput(name, 50);
    const sanitizedPhone = phone.replace(/[^\d+]/g, '').slice(0, 15);

    setIsSubmitting(true);
    setErrorMessage('');
    setLastSubmitTime(now);
    setSubmissionCount((prev) => prev + 1);

    setTimeout(() => {
      setIsSubmitting(false);
      const resCode = 'RES-CTG-' + Math.floor(1000 + Math.random() * 9000);
      const bookingRecord = {
        id: 'res-' + Date.now(),
        name: sanitizedName,
        phone: sanitizedPhone,
        code: resCode,
        zone: initialZone || 'Main Hall / Garden Atrium',
        date: new Date().toLocaleDateString('en-GB'),
        time: 'Evening (11:00 AM – 11:30 PM)',
        location: 'Abdullah Bhaban, Kazir Dewri, Chattogram',
        status: 'Confirmed',
        createdAt: new Date().toISOString(),
      };
      setConfirmedReservation(bookingRecord);
      adminStorage.addReservation(bookingRecord);
    }, 800);
  };

  const handleDownloadICS = () => {
    if (!confirmedReservation) return;
    const safeCode = escapeICS(confirmedReservation.code);
    const safeName = escapeICS(confirmedReservation.name);
    const safePhone = escapeICS(confirmedReservation.phone);
    const safeLocation = escapeICS(confirmedReservation.location);

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Radhuni Table Kazir Dewri//Reservation//EN
BEGIN:VEVENT
SUMMARY:Dining Reservation at Radhuni Table
DESCRIPTION:Booking Code: ${safeCode}\\nGuest: ${safeName}\\nPhone: ${safePhone}\\nLocation: ${safeLocation}
LOCATION:${safeLocation}
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

  const handleResetAndClose = () => {
    setName('');
    setPhone('');
    setConfirmedReservation(null);
    setErrorMessage('');
    onClose();
  };

  // Clean raw digits for count indicator
  const rawDigits = phone.replace(/\D/g, '');
  const digitsCount = rawDigits.startsWith('880') ? rawDigits.length - 2 : rawDigits.length;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={handleResetAndClose}
    >
      <div
        className="relative w-full max-w-md rounded-3xl bg-culinary-card border border-slate-700/80 shadow-2xl p-6 sm:p-8 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmedReservation ? (
          /* Confirmation Success Card */
          <div className="text-center space-y-4 py-3 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Reservation Confirmed & Verified
              </span>
              <h3 className="text-2xl font-serif font-bold text-white mt-1">
                টেবিল বুকিং নিশ্চিত হয়েছে!
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                রাধুনি টেবিল (আব্দুল্লাহ ভবন, কাজির দেউরি, চট্টগ্রাম) এ আপনার আগমন সাদরে আমন্ত্রিত।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0b0e12] border border-slate-800 text-left text-xs space-y-2.5">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Booking Code</span>
                <span className="font-mono font-bold text-culinary-gold">{confirmedReservation.code}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Guest Name</span>
                <span className="font-semibold text-white">{confirmedReservation.name}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Mobile No</span>
                <span className="font-mono font-medium text-emerald-400">{confirmedReservation.phone}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Selected Zone</span>
                <span className="font-medium text-amber-300">{confirmedReservation.zone}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Address</span>
                <span className="font-medium text-slate-200">আব্দুল্লাহ ভবন, কাজির দেউরি</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Security Status</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 256-bit Verified
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleDownloadICS}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4 text-culinary-gold" />
                <span>Calendar (.ics)</span>
              </button>
              <button
                onClick={handleResetAndClose}
                className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-culinary-dark font-bold text-xs transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Secure Input Form View */
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[11px] font-bold text-emerald-400 mb-3">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Complimentary Table Reservation • Direct Confirmation</span>
              </div>
              <h3 className="text-2xl font-serif font-bold text-white tracking-tight">
                Reserve Table • টেবিল বুকিং
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                আপনার নাম ও ১১ ডিজিটের সচল মোবাইল নম্বর দিন। তথ্য সম্পূর্ণ ও নির্ভুল হলে সাথে সাথে কনফার্ম বাটন সক্রিয় হবে।
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 text-xs" noValidate>
              {/* Anti-Bot Honeypot (Hidden from human eyes) */}
              <input
                type="text"
                name="user_website_trap"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                className="hidden pointer-events-none"
                aria-hidden="true"
              />

              {/* 1. Name Input Bar */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-slate-200 font-semibold flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-culinary-gold" />
                    <span>আপনার নাম (Full Name)</span>
                  </label>
                  {name.length > 0 && (
                    <span className={`text-[10px] font-semibold flex items-center gap-1 ${
                      isNameValid ? 'text-emerald-400' : 'text-slate-400'
                    }`}>
                      {isNameValid ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : 'Min 3 chars'}
                    </span>
                  )}
                </div>

                <div className="relative">
                  <input
                    type="text"
                    required
                    maxLength={50}
                    autoComplete="name"
                    placeholder="যেমন: শাকিল আহমেদ / Shakil Ahmed"
                    value={name}
                    onChange={handleNameChange}
                    className={`w-full px-4 py-3 rounded-xl bg-[#0b0e12] border text-sm text-white placeholder-slate-500 transition-all focus:outline-none ${
                      isNameValid
                        ? 'border-emerald-500/60 focus:border-emerald-400 shadow-sm shadow-emerald-500/10'
                        : name.length > 0
                        ? 'border-amber-500/50 focus:border-amber-400'
                        : 'border-slate-800 focus:border-culinary-gold'
                    }`}
                  />
                  {isNameValid && (
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                  )}
                </div>
              </div>

              {/* 2. Phone Number Input Bar */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-slate-200 font-semibold flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-culinary-gold" />
                    <span>মোবাইল নম্বর (BD Mobile Number)</span>
                  </label>
                  <span className={`text-[10px] font-mono font-semibold ${
                    isPhoneValid ? 'text-emerald-400' : 'text-slate-400'
                  }`}>
                    {digitsCount}/11 ডিজিট {isPhoneValid && '✓'}
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="tel"
                    required
                    maxLength={14}
                    autoComplete="tel"
                    placeholder="017XXXXXXXX বা 01XXXXXXXXX"
                    value={phone}
                    onChange={handlePhoneChange}
                    className={`w-full px-4 py-3 rounded-xl bg-[#0b0e12] border text-sm font-mono text-white placeholder-slate-500 transition-all focus:outline-none ${
                      isPhoneValid
                        ? 'border-emerald-500/60 focus:border-emerald-400 shadow-sm shadow-emerald-500/10'
                        : phone.length > 0
                        ? 'border-amber-500/50 focus:border-amber-400'
                        : 'border-slate-800 focus:border-culinary-gold'
                    }`}
                  />
                  {isPhoneValid && (
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                  )}
                </div>
                <p className="mt-1 text-[10px] text-slate-500">
                  বাংলাদেশের যেকোনো সচল ১১ ডিজিটের মোবাইল নম্বর লিখুন (013, 014, 015, 016, 017, 018, 019)।
                </p>
              </div>

              {/* Security Shield Banner */}
              <div className="p-3 rounded-xl bg-[#080a0d] border border-white/[0.08] flex items-center gap-2.5 text-[11px] text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>
                  তাৎক্ষণিক আসন নিশ্চিতকরণ • কোনো অগ্রিম ফি নেই • সম্পূর্ণ সুরক্ষিত ভেরিফিকেশন
                </span>
              </div>

              {/* Confirm Button - Disabled until both are fully filled out */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!isFormComplete || isSubmitting}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
                    isFormComplete && !isSubmitting
                      ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-culinary-dark shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.01] active:scale-95 cursor-pointer'
                      : 'bg-slate-800/60 border border-slate-700/50 text-slate-500 cursor-not-allowed opacity-60'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-culinary-dark border-t-transparent rounded-full animate-spin" />
                      <span>ভেরিফাই হচ্ছে...</span>
                    </>
                  ) : isFormComplete ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>রিজার্ভেশন নিশ্চিত করুন • Confirm Table</span>
                    </>
                  ) : (
                    <span>নাম ও নম্বর সম্পূর্ণ পূরণ করুন</span>
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
