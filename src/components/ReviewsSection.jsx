import React, { useState, useEffect } from 'react';
import { Star, MessageSquarePlus, CheckCircle, ExternalLink, ThumbsUp, Sparkles, Filter, User, AlertCircle } from 'lucide-react';
import { ratingSummary } from '../data/reviewsData';
import { adminStorage } from '../services/adminStorageService';

export default function ReviewsSection() {
  const [reviews, setReviews] = useState(() => adminStorage.getReviews());
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setReviews(adminStorage.getReviews());
    };
    window.addEventListener('radhuni_store_updated', handleUpdate);
    return () => window.removeEventListener('radhuni_store_updated', handleUpdate);
  }, []);
  const [newReview, setNewReview] = useState({
    author: '',
    rating: 5,
    comment: '',
    favorite: '',
  });
  const [honeypot, setHoneypot] = useState(''); // Anti-bot hidden trap
  const [formError, setFormError] = useState('');
  const [lastReviewTime, setLastReviewTime] = useState(0); // Rate limit cooldown
  const [reviewCount, setReviewCount] = useState(0);
  const [submittedToast, setSubmittedToast] = useState(false);

  const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=Abdullah+Bhaban,+Kazir+Dewri,+Chattogram";

  const sanitizeText = (val, maxLen = 500) => {
    if (!val) return '';
    return String(val)
      .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // remove ASCII control characters
      .replace(/[\u200B-\u200D\uFEFF]/g, '') // remove zero-width spaces
      .replace(/[<>'"`;\\=`]/g, '') // remove injection delimiters
      .replace(/javascript:/gi, '')
      .replace(/data:/gi, '')
      .replace(/script/gi, '')
      .trim()
      .slice(0, maxLen);
  };

  // Block links, URLs, and known promotional spam domains
  const containsSpamLinks = (text) => {
    if (!text) return false;
    const urlPattern = /(https?:\/\/|www\.|\.xyz|\.top|\.ru|\.click|t\.me\/|wa\.me\/|bit\.ly)/i;
    return urlPattern.test(text);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    // Security Gate 1: Honeypot trap check
    if (honeypot) {
      setFormError('Security violation detected: automated submission blocked.');
      return;
    }

    // Security Gate 2: Rate limit & cooldown
    const now = Date.now();
    if (now - lastReviewTime < 20000) {
      const waitSeconds = Math.ceil((20000 - (now - lastReviewTime)) / 1000);
      setFormError(`অতিরিক্ত অনুরোধ রোধ করা হয়েছে। অনুগ্রহ করে ${waitSeconds} সেকেন্ড অপেক্ষা করুন। (Please wait ${waitSeconds}s before submitting again)`);
      return;
    }

    if (reviewCount >= 3) {
      setFormError('সেশন লিমিট পূর্ণ হয়েছে। নতুন রিভিউ যোগ করার জন্য অনুগ্রহ করে পেজটি রিফ্রেশ করুন।');
      return;
    }

    // Security Gate 3: Spam link detection
    if (containsSpamLinks(newReview.author) || containsSpamLinks(newReview.comment) || containsSpamLinks(newReview.favorite)) {
      setFormError('নিরাপত্তাজনিত কারণে রিভিউতে কোনো ওয়েবসাইট লিংক বা প্রচারমূলক URL দেওয়া নিষিদ্ধ।');
      return;
    }

    // Security Gate 4: Input length validation
    const cleanAuthor = sanitizeText(newReview.author, 50);
    const cleanComment = sanitizeText(newReview.comment, 500);
    const cleanFavorite = sanitizeText(newReview.favorite, 80);

    if (cleanAuthor.length < 2) {
      setFormError('অনুগ্রহ করে অন্তত ২ অক্ষরের একটি সঠিক নাম লিখুন।');
      return;
    }

    if (cleanComment.length < 10) {
      setFormError('রিভিউ বিবরণী অন্তত ১০ অক্ষরের হতে হবে।');
      return;
    }

    const userEntry = {
      id: 'rev-user-' + Date.now(),
      author: cleanAuthor,
      role: 'Verified Foodie',
      avatar: '',
      rating: Math.min(5, Math.max(1, Number(newReview.rating) || 5)),
      date: 'Just now',
      source: 'Direct Review',
      comment: cleanComment,
      favoriteItems: cleanFavorite ? [cleanFavorite] : ['Radhuni Table Signature'],
      verifiedDiner: true,
    };

    const updatedReviews = [userEntry, ...reviews];
    setReviews(updatedReviews);
    adminStorage.saveReviews(updatedReviews);
    setShowReviewForm(false);
    setNewReview({ author: '', rating: 5, comment: '', favorite: '' });
    setHoneypot('');
    setLastReviewTime(now);
    setReviewCount((prev) => prev + 1);
    setSubmittedToast(true);
    setTimeout(() => setSubmittedToast(false), 4000);
  };

  return (
    <section id="reviews" className="scroll-mt-28 py-20 bg-culinary-dark border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-culinary-gold text-xs font-semibold uppercase tracking-wider mb-2">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>Verified Diner Feedback</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              Loved by Chattogram's Epicures
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-xl">
              Real reviews from Google Maps and local guides celebrating our food hall atmosphere, diversity of stalls, and signature dishes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-culinary-dark shadow-md shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>{showReviewForm ? 'Cancel Review' : 'Write a Review'}</span>
            </button>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-200 border border-slate-700/80 transition-all flex items-center gap-1.5"
            >
              <span>See 4,800+ on Google</span>
              <ExternalLink className="w-3 h-3 text-culinary-gold" />
            </a>
          </div>
        </div>

        {/* Toast confirmation */}
        {submittedToast && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Thank you for your review! It has been posted to the feed.</span>
          </div>
        )}

        {/* Rating Breakdown Banner */}
        <div className="p-6 md:p-8 rounded-3xl bg-culinary-card border border-slate-800 shadow-xl mb-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4 text-center md:text-left border-b md:border-b-0 md:border-r border-slate-800 pb-6 md:pb-0 md:pr-8">
            <span className="font-serif text-5xl sm:text-6xl font-extrabold text-white block">
              {ratingSummary.averageRating}
            </span>
            <div className="flex items-center justify-center md:justify-start gap-1 my-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-400">
              Based on <strong>4,890+ verified diners</strong> on Google Maps
            </p>
          </div>

          <div className="md:col-span-8 space-y-2 text-xs">
            {[5, 4, 3, 2, 1].map((stars) => {
              const pct = ratingSummary.distribution[stars] || 0;
              return (
                <div key={stars} className="flex items-center gap-3">
                  <span className="w-12 text-slate-400 flex items-center gap-1">
                    <span>{stars}</span>
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  </span>
                  <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-slate-400 font-mono">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit Review Form (collapsible) */}
        {showReviewForm && (
          <div className="mb-12 p-6 sm:p-8 rounded-3xl bg-[#0e1216] border border-amber-500/40 shadow-2xl animate-in slide-in-from-top-4 duration-300">
            <h3 className="text-lg font-serif font-bold text-white mb-1">
              Share Your Radhuni Table Experience
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Tell the community about your favorite stall, seat zone, or dish!
            </p>

            {/* Form Error Banner */}
            {formError && (
              <div className="mb-4 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs" noValidate>
              {/* Anti-Bot Honeypot Trap */}
              <input
                type="text"
                name="website_feedback_trap"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                className="hidden pointer-events-none"
                aria-hidden="true"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    maxLength={50}
                    placeholder="e.g. Farhan Ahmed"
                    value={newReview.author}
                    onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-culinary-card border border-slate-800 text-white focus:outline-none focus:border-culinary-gold"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Star Rating</label>
                  <select
                    value={newReview.rating}
                    onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-culinary-card border border-slate-800 text-white focus:outline-none focus:border-culinary-gold cursor-pointer"
                  >
                    <option value={5}>5 Stars — Exceptional Dining</option>
                    <option value={4}>4 Stars — Great Hospitality & Taste</option>
                    <option value={3}>3 Stars — Average Experience</option>
                    <option value={2}>2 Stars — Needs Improvement</option>
                    <option value={1}>1 Star — Disappointing</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Favorite Dish or Stall</label>
                <input
                  type="text"
                  maxLength={80}
                  placeholder="e.g. Darbar Butter Chicken, Turkish Shish, or Pistachio Gelato"
                  value={newReview.favorite}
                  onChange={(e) => setNewReview({ ...newReview, favorite: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-culinary-card border border-slate-800 text-white focus:outline-none focus:border-culinary-gold"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Your Review</label>
                <textarea
                  rows={3}
                  required
                  maxLength={500}
                  placeholder="Describe the flavors, service, seating ambiance..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-culinary-card border border-slate-800 text-white focus:outline-none focus:border-culinary-gold"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-culinary-dark shadow-md cursor-pointer"
                >
                  Publish Review
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-3xl bg-culinary-card border border-slate-800/90 shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Modest Luxury Culinary Monogram (No generic or unmodest portraits) */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600/30 via-culinary-gold/20 to-amber-400/10 border border-amber-500/40 flex items-center justify-center text-amber-300 font-bold text-sm shadow-md flex-shrink-0">
                      {rev.author ? rev.author.charAt(0).toUpperCase() : 'R'}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{rev.author}</h4>
                      <p className="text-[11px] text-slate-400">{rev.role}</p>
                    </div>
                  </div>

                  <span className="text-[11px] text-slate-500 font-medium">
                    {rev.date}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < rev.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-slate-700 text-slate-700'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/5 text-slate-300">
                    {rev.source}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              {rev.favoriteItems && rev.favoriteItems.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Ordered:</span>
                  {rev.favoriteItems.map((item) => (
                    <span
                      key={item}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
